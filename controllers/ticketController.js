const ticket = require('../models/ticket');

const createTicket = async (req, res) => {
    try {
        const { title, description, assignedTo } = req.body;

        const newTicket = new ticket({
            title,
            description,
            assignedTo,
            createdBy: req.user.userId,
            tenantId: req.user.tenantId,
        });

        await newTicket.save();

        res.status(201).json({
            message: 'Ticket created successfully',
            ticket: newTicket
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error creating ticket',
            error: error.message
        });
    }
};

const getTickets = async (req, res) => {
    try {
        let query = { tenantId: req.user.tenantId };

        if (req.user.role === 'agent') {
            query.assignedTo = req.user.userId;
        } else if (req.user.role === 'member') {
            query.createdBy = req.user.userId;
        }

        const tickets = await ticket.find(query);

        res.status(200).json({ tickets });

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching tickets',
            error: error.message
        });
    }
};
const updateTicket = async (req, res) => {
    try {
        const {status} = req.body;
        const foundTicket = await ticket.findOne({
            _id: req.params.id,
            tenantId: req.user.tenantId
        });
        if (!foundTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        foundTicket.status = status;
        await foundTicket.save();
        res.status(200).json({ message: 'Ticket updated successfully', ticket: foundTicket });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating ticket',
            error: error.message
        });
    }
};
const assignTicket = async (req, res) => {
    try {
        const { agentId } = req.body;

        const foundTicket = await ticket.findOne({
            _id: req.params.id,
            tenantId: req.user.tenantId
        });

        if (!foundTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        foundTicket.assignedTo = agentId;
        await foundTicket.save();

        res.status(200).json({ message: 'Ticket assigned successfully', ticket: foundTicket });

    } catch (error) {
        res.status(500).json({
            message: 'Error assigning ticket',
            error: error.message
        });
    }
};

const deleteTicket = async (req, res) => {
    try {
        const deleteTicket = await ticket.findOneAndDelete({
            _id:req.params.id,
            tenantId:req.user.tenantId
        })
        if(!deleteTicket){
            return res.status(404).json({ message: 'Ticket not found' });
        }
        return res.status(200).json({ message: 'Ticket deleted successfully', ticket: deletedTicket });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error deleting ticket',
            error: error.message
        })
    }
}
module.exports = {
    createTicket,
    getTickets,
    updateTicket,
    assignTicket,
    deleteTicket   
};
