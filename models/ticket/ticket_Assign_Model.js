import { poolPromise, sql } from "../../config/db.js";

/**
 * CREATE / UPDATE = Assign or Reassign Ticket
 */
export const assignTicket = async ({ ticket_id, agent_id, assigned_by, status = 'On Progress' }) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input("ticket_id", sql.Int, ticket_id)
        .input("agent_id", sql.Int, agent_id)
        .input("assigned_by", sql.Int, assigned_by)
        .input("status", sql. VarChar(50), status)
        .query(`
            INSERT INTO sg.ticketing_assignments
                (ticket_id, assigned_by, agent_id, status)
            VALUES (@ticket_id, @assigned_by, @agent_id, @status)
        `);

    await pool.request()
        .input("ticket_id", sql.Int, ticket_id)
        .input("agent_id", sql.Int, agent_id)
        .input("status", sql.VarChar(50), status)
        .query(`
            UPDATE sg.ticketing_tickets
            SET
                agent_id = @agent_id,
                assigned_at = GETDATE(),
                status = @status
            WHERE id = @ticket_id
        `);
        
    return res.recordset[0];
};

/**
 * READ = Get all assigned tickets
 */
export const getAllAssignments = async () => {
    const pool = await poolPromise;
    const res = await pool.request()
        .query(`
            SELECT
                a.id,
                a.ticket_id,
                a.assigned_by,
                a.agend_id,
                a.status,
                a.assigned_at,
                t.subject,
                up_assigned.first_name AS assigned_by_name,
                up_assigned,last_name AS assigned_by_last_name,
                up_agent.first_name AS agent_name,
                up_agent.last_name AS agent_last_name
            FROM sg.ticketing_assignments a
            JOIN sg.ticketing_tickets t ON t.id = ticket_id
            JOIN sg.ticketing_user_profiles up_assigned ON up_assigned.user_id = a.assigned_by
            LEFT JOIN sg.ticketing_user_profiles up_agent ON up_agent.user_id = a.agent_id
            ORDER BY a.assigned_at DESC
        `);
    return res.recordset;
}

/**
 * READ assignments by agent
 */
export const getAssignmentsByAgent = async (agent_id) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input("agent_id", sql.Int, agent_id)
        .query(`
            SELECT 
                a.id,
                a.ticket_id,
                a.assigned_by,
                a.agent_id,
                a.status,
                a.assigned_at,
                t.subject,
                up_assigned.first_name AS assigned_by_name,
                up_assigned.last_name AS assigned_by_last_name
            FROM sg.ticketing_assignments a
            JOIN sg.ticketing_tickets t ON t.id = a.ticket_id
            JOIN sg.ticketing_user_profiles up_assigned ON up_assigned.user_id = a.assigned_by
            WHERE a.agent_id = @agent_id
            ORDER BY a.assigned_at DESC
        `);
    return res.recordset;
}

/**
 * // UPDATE assignment (reassign)
 */

export const updateAssignment = async ({ id, agent_id, status}) => {
    const pool = await poolPromise;
    await pool.request()
        .input("id", sql.Int, id)
        .input("agent_id", sql.Int, agent_id)
        .input("status", sql.VarChar(50), status)
        .query(`
            UPDATE sg.ticketing_assignments
            SET agent_id = @agent_id,
                status = @status,
                assigned_at = GETDATE()
            WHERE id = @id
        `);
    
    // Update main ticket too
    await pool.request()
        .input("id", sql.Int, id)
        .input("agent_id", sql.Int, agent_id)
        .input("status", sql.VarChar(50), status)
        .query(`
            UPDATE sg.ticketing_tickets
            SET agent_id = @agent_id,
                status = @status,
                assigned_at = GETDATE()
            WHERE id = (SELECT ticket_id FROM sg.ticketing_assignments WHERE id = @id)
        `);
    
    return true;
};


export const deleteAssignment = async (id) => {
    const pool = await poolPromise;

    const res = await pool.request()
        .input("id", sql.Int, id)
        .query(`
            SELECT ticket_id FROM sg.ticketing_assignments 
            WHERE id = @id
        `);
    
    const ticket_id = res.recordset[0]?.ticket_id;

    await pool.request()
        .input("id", sql.Int, id)
        .query(`
            DELETE FROM sg.ticketing_assignments 
            WHERE id = @id
        `);
    
    if (ticket_id) {
        await pool.request()
        .input("ticket_id", sql.Int, ticket_id)
        .query(`
            UPDATE sg.ticketing_tickets
            SET agent_id = NULL, 
                status = 'PENDING',
                assigned_at = NULL
            WHERE id = @ticket_id
        `);
    }

    return true;
}
export const getAssignedTickets = async () => {
    const pool = await poolPromise;
    const res = await pool.request()
        .query(`
            SELECT *
            FROM sg.ticketing_tickets
            WHERE agent_id 
                IS NOT NULL
            ORDER BY assigned_at DESC
        `);
    return res.recordset;
};

/**
 * READ = Get all unassigned tickets
 */
export const getUnassignedTickets = async () => {
    const pool = await poolPromise;
    const res = await pool.request().query(`
        SELECT * 
        FROM sg.ticketing_tickets
        WHERE agent_id IS NULL
        ORDER BY created_at DESC
    `);
    return res.recordset;
};

/**
 * READ = Get tickets by agent
 */
export const getTicketsByAgent = async (agent_id) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input("agent_id", sql.Int, agent_id)
        .query(`
            SELECT *
            FROM sg.ticketing_tickets
            WHERE agent_id = @agent_id
            ORDER BY assigned_at DESC
        `);
    return res.recordset;
};

/**
 * DELETE = Unassign ticket
 */
export const unassignTicket =async (ticket_id) => {
    const pool = await poolPromise;
    await pool.request()
        .input("ticket_id", sql.Int, ticket_id)
        .query(`
            UPDATE sg.ticketing_tickets
            SET
                agent_id = NULL,
                assigned_at = NULL,
                status = 'TO DO',
                updated_at = GETDATE()
            WHERE id = @ticket_id
        `);
};