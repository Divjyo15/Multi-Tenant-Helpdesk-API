const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Tenant = require('../models/Tenant');

const register = async (req, res) => {
    let newTenant;
    try {
        const { name, email, password, companyName } = req.body;

        // Pehle check kar lo email already exists toh nahi
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        newTenant = new Tenant({ name: companyName });
        await newTenant.save();

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
            tenantId: newTenant._id
        });
        await user.save();

        const token = jwt.sign(
            { userId: user._id, tenantId: user.tenantId, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.status(201).json({ message: 'User registered successfully', token });

    } catch (error) {
        // Agar user save fail hua (koi bhi reason - duplicate, validation etc)
        // toh orphaned tenant delete kar do
        if (newTenant && newTenant._id) {
            await Tenant.findByIdAndDelete(newTenant._id).catch(() => {});
        }

        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
}
    const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, tenantId: user.tenantId, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

const inviteTeamMember = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Duplicate check
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,                          // admin decide karta hai role (agent/member)
            tenantId: req.user.tenantId    // request se NAHI, admin ke apne token se
        });

        await newUser.save();

        res.status(201).json({
            message: 'Team member added successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email already registered' });
        }
        res.status(500).json({ message: 'Error adding team member', error: error.message });
    }
};
module.exports = { register, login, inviteTeamMember };