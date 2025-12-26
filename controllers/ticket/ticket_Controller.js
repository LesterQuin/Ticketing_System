// ticket/ticket_Controller.js
import * as Ticket from '../../models/ticket/ticket_Model.js'

// Create Ticket(USER)
export const createTicket = async (req, res) => {
    try {
        const { user_id, agent_id, subject, description, priority } = req.body;

        // Validation
        if (!user_id || !subject || !description) {
            return res.status(400).json({ message: 'user_id, subject, and description are required' });
        }

        const ticketId = await Ticket.createTicket({ user_id, agent_id, subject, description, priority });

        res.status(201).json({
            success: true,
            ticket_id: ticketId,
            message: 'Ticket created successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get ticket (USER sees own, ADMIN sees ALL)
export const getTickets = async (req,res) => {
    try {
        const tickets = req.user.role === 'user'
            ? await Ticket.getTicketsByUser(req.user.id)
            : await Ticket.getAllTickets();
        
        res.json({ success: true, tickets });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// Assign ticket (ADMIN / SUPERADMIN)
export const assignTicket = async (req, res) => {
    try {
        const { ticket_id, agent_id } = req.body;

        if (!ticket_id || !agent_id){
            return res.status(400).json({ message: "ticketID and agentID are required" });
        }
        await Ticket.assignTicket(ticket_id, agent_id);

        res.status(200).json({
            success: true, 
            message: `Ticket ${ticket_id} assigned to agent ${agent_id}`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// Update status (AGENT / ADMIN)
export const updateStatus = async (req, res) => {
    try {
        const { ticket_id, status } = req.body;

        if ( !ticket_id || !status ){
            return res.status(400).json({ 
                message: "TicketId and status are required"
            });
            }
            const allowedStatuses = ['Open', 'Pending', 'Cancelled', 'Resolved', 'Closed'];
            if (!allowedStatuses.includes(status)){
                return res.status(400).json({ message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
            }

            await Ticket.updateStatus({ ticket_id, status });

            res.status(200).json({
                success: true,
                message: `Ticket ${ticket_id} status updated to ${status}`
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// Add comment 
export const addComment = async (req, res) => {
    try {
        const { comment } = req.body;
        if ( !comment ) return res.status(400).json({ message: "Comment required."})

        await Ticket.addComment({
            ticket_id: req.params.id,
            user_id: req.user.id,
            comment
        });

        res.status(201).json({ success: true, message: "Comment added." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export const listComments = async (req, res) => {
    const { ticket_id } = req.params;
    const comments = await Ticket.getComments(ticket_id);
    res.json({ success: true, comments });
}