// ticket/ticket_Controller.js
import * as Ticket from '../../models/ticket/ticket_Model.js'

// Create Ticket(USER)
export const createTicket = async (req, res) => {
    try {
        const { subject, description, priority } = req.body;

        if (!subject || !description)
            return res.status(400).json({ message: "Missing required fields" });

        const ticketId = await Ticket.createTicket({
            user_id: req.user_id,
            subject,
            description,
            priority
        });

        res.status(201).json ({ success: true, ticket_id: ticketId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'SERVER ERROR' });
    }
}

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

        await Ticket.assignTicket(ticket_id, agent_id);

        res.json({ success: true, message: "Ticket assigned" });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}