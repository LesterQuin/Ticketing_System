import * as Assign from "../../models/ticket/ticket_Assign_Model.js"

// CREATE
export const createAssignment = async (req, res) => {
    try {
        const { ticket_id, assigned_by, agent_id, status } = req.body;
        if (!ticket_id || !assigned_by || !agent_id)
            return res.status(400).json({
                message: "ticket_id, assigned_by and agent_id are required."
            });
        
        await Assign.assignTicket({ ticket_id, assigned_by, agent_id, status })
        res.json({
            success: true,
            message: "Assignment created"
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Server Error."
        });
    }
};

// READ ALL
export const getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assign.getAllAssignments();
        res.json({
            success: true,
            assignments
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Server Error."
        });
    }
};

// READ BY AGENT
export const getAssignmentsByAgent = async (req, res) => {
    try {
        const { agent_id } = req.params;
        const assignments = await Assign.getAssignmentsByAgent(agent_id);
        res.json({
            success: true,
            assignments
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Server Error."
        });
    }
};

// UPDATE
export const updateAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const { agent_id, status } = req.body;
        
        if (!id || !agent_id || !status) {
                return res.status(400).json({
                    message: "id, agent_id, and status is required."
            });
        }

        await Assign.updateAssignment({ 
            id,
            agent_id,
            status
        });
        res.json({
            success: true,
            message: "Assignment Updated."
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Server Error."
        });
    }
};

// DELETE ASSIGNMENT
export const deleteAssignment = async (req, res) => {
    try {
        const { id }= req.params;
        await Assign.deleteAssignment(id);
        res.json({
            success: true,
            message: "Assignment Deleted."
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Server Error."
        });
    }
};


export const assignTicket = async (req, res) => {
    try {
        const { ticket_id, agent_id } = req.body;

        if (!ticket_id || !agent_id) {
            return res.status(400).json({
                message: "ticket_id and agent_id required."
            });
        }

        const ticket = await Assign.assignTicket({
                ticket_id,
                agent_id,
                assigned_by: req.user.id,
                status: "On Progress"
            });

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

// GET ASSIGNED TICKETS
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

// GET UNASSIGNED
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

// GET TICKETS BY AGENT
export const getTicketsByAgent = async (req, res) => {
    try {
        const ticket = await Assign.getTicketsByAgent(req.params.agent_id);
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


// UNASSIGN
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