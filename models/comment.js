const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({ 
    content: { type: String, required: true },
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true }
}, { timestamps: true
})
module.exports = mongoose.model('Comment', commentSchema);