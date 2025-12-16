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