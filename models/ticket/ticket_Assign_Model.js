import { poolPromise, sql } from "../../config/db.js";

/**
 * CREATE / UPDATE = Assign or Reassign Ticket
 */
export const assignTicket = async (ticket_id, agent_id) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input("ticket_id", sql.Int, ticket_id)
        .input("agent_id", sql.Int, agent_id)
        .query(`
            UPDATE sg.ticketing_tickets
            SET
                agent_id = @agent_id,
                assigned_at = GETDATE(),
                status = 'TO DO
            WHERE id = @ticket_id
            
            SELECT *
            FROM sg.ticketing_tickets 
            WHERE id = @ticket_id
        `);
    return res.recordset[0];
};

/**
 * READ = Get all assigned tickets
 */
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
                updated-at = GETDATE()
            WHERE id = @ticket_id
        `);
};