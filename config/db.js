const mongoose = require('mongoose');
const dns = require('dns');

// Force Node's resolver to use Google DNS instead of the OS default
dns.setServers(['8.8.8.8', '8.8.4.4']);

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');
        console.log('📊 Database:', mongoose.connection.name);
    } catch (err) {
        console.error('❌ MongoDB error:', err.message);
        process.exit(1);
    }
};

module.exports = ConnectDB;