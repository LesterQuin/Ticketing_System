// ticket/ticket_Model.js
import { poolPromise, sql } from "../../config/db.js"

// Create a ticket
export const createTicket = async ({ user_id, subject, description, priority }) => {
    const pool = await poolPromise

    const result = await pool.request()
        .input("user_id", sql.Int, user_id)
        .input("subject", sql.VarChar(255), subject)
        .input("description", sql.Text, description)
        .input("priority", sql.VarChar(10), priority || 'Medium')
        .query(`
            INSERT INTO sg.ticketing_tickets
                (user_id, subject, description, priority
            VALUES
                (@user_id, @subject, @description, @priority)
            SELECT SCOPE_IDENTITY() AS id;
        `);
    return result.recordset[0].id;
}

// Get Ticket by User
export const getTicketsByUser = async (user_id) => {
    const pool = await poolPromise;

    const result = await pool.request()
        .input("user_id", sql.Int, user_id)
        .query(`
            SELECT *
            FROM sg.ticketing_tickets
            WHERE user_id = @user_id
            ORDER BY created_at DESC
        `);
    return result.recordset;
};

// Get all ticket (admin/superadmin)
export const getAllTickets = async () => {
    const pool = await poolPromise;

    const result = await pool.request()
        .query(`
            SELECT *
            FROM sg.ticketing_tickets
            ORDER BY created_at DESC
        `);
    
    return result.recordset;
}

// Assign IT
export const assignTicket = async (ticket_id, agent_id) => {
    const pool = await poolPromise;

    await pool.request()
        .input("ticket_id", sql.Int, ticket_id)
        .input("agent_id", sql.Int, agent_id)
        .query(`
            UPDATE sg.ticketing_tickets
            SET agent_id = @agent_id,
                assisgned_at = GETDATE(),
                status = 'On Progress'
            WHERE id = @ticket_id
        `);
};

// Update ticket status
export const updateStatus = async (ticket_id, status) => {
    const pool = await poolPromise;

    let dateColumn = null;
    if (status === 'Resolved') dateColumn = 'resolved_at';
    if (status === 'Closed') dateColumn = 'closed_at';
    if (status === 'Cancelled') dateColumn = 'cancelled_at';

    const query = `
        UPDATE sg.ticketing_tickets
        SET status = @status
        ${dateColumn ? `, ${dateColumn} = GETDATE()` : ''}
        WHERE id = @ticket_id
    `;

    await pool.request()
        .input('ticket_id', sql.Int, ticket_id)
        .input('status', sql.VarChar(20), status)
        .query(query);
};

// Add Comment
export const addComment = async ({ ticket_id, user_id, comment}) => {
    const pool = await poolPromise;
    await pool.request()
        .input("ticket_id", sql.Int, ticket_id)
        .input("user_id", sql.Int, user_id)
        .input("comment", sql.Text, comment)
        .query(`
            INSERT INTO sg.ticketing_ticket_comments (ticket_id, user_id, comment)
            VALUES (@ticket_id, @user_id, @comment
        `);
}

export const getComments = async (ticket_id) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input("ticket_id", sql.Int, ticket_id)
        .query(`
            SELECT c.*, u.first_name, u.last_name
            FROM sg.ticketing_ticket_comments c 
            JOIN sg.ticketing_users u ON u.id = c.user_id
            WHERE c.ticket_id = @ticket_id
            ORDER BY c.created_at ASC
        `);
    
        return res.recordset;
}