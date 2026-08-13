const Comment = require('../models/comment');
const Ticket = require('../models/Ticket');

const createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { ticketId } = req.params;

        // pehle check karo ki ye ticket exist karta hai aur same tenant ka hai
        const foundTicket = await Ticket.findOne({
            _id: ticketId,
            tenantId: req.user.tenantId
        });

        if (!foundTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const newComment = new Comment({
            content,
            ticketId,
            createdBy: req.user.userId,
            tenantId: req.user.tenantId
        });

        await newComment.save();

        res.status(201).json({ message: 'Comment added successfully', comment: newComment });

    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
};

const getComments = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const comments = await Comment.find({
            ticketId,
            tenantId: req.user.tenantId
        });

        res.status(200).json({ comments });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
};

module.exports = {
    createComment,
    getComments
};
