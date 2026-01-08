import * as Assign from "../../models/ticket/ticket_Assign_Model.js"

/**
 * CREATE / UPDATE (Assign or Reassign)
 */
export const assignTicket = async (req, res) => {
    try {
        const { ticket_id, agent_id } = req.body;

        if (!ticket_id || !agent_id) {
            return res.status(400).json({
                message: "ticket_id and agent_id required."
            });
        }

        const ticket = await Assign.assignTicket(ticket_id, agent_id);

        res.json({
            success: true,
            ticket,
            message: "Ticket assigned successfully."
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error."
        });
    }
};

/**
 * READ — Assigned tickets
 */
export const getAssignedTickets = async (req, res) => {
    try {
        const tickets = await Assign.getAssignedTickets();
        res.json({
            success: true,
            tickets
        });
    } catch (err) {
        res.status(500).json({
            message: "Server Error."
        });
    }
};

/**
 * READ — Unassigned tickets
 */
export const getUnassignedTickets = async (req, res) => {
    try {
        const tickets = await Assign.getUnassignedTickets();
        res.json({
            success: true,
            tickets
        });
    } catch (err) {
        res.status(500).json({
            message: "Server Error."
        });
    }
};

/**
 * READ — Tickets by agent
 */
export const getTicketsByAgent = async (req, res) => {
    try {
        const ticket = await Assign.getTicketsByAgent(req.params.id);
        res.json({
            success: true,
            ticket
        });
    } catch (err) {
        res.status(500).json({
            message: "Server Error."
        });
    }
};

/**
 * DELETE — Unassign ticket
 */
export const unassignTicket = async (req, res) => {
    try {
        await Assign.unassignTicket(req.params.id);
        res.json({
            success: true,
            message: "Ticket unassigned successfully."
        })
    } catch (err) {
        res.status(500).json({
            message: "Server Error."
        });
    }
};