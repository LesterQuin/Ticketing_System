// ticket/ticket_Model.js
import { poolPromise, sql } from "../../config/db.js"

// Create a ticket
export const createTicket = async ({ user_id, agent_id = null, subject, description, priority = 'Medium' }) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input('user_id', sql.Int, user_id)
        .input('agent_id', sql.Int, agent_id)
        .input('subject', sql.VarChar(255), subject)
        .input('description', sql.Text, description)
        .input('priority', sql.VarChar(10), priority)
        .query(`
            INSERT INTO sg.ticketing_tickets (user_id, agent_id, subject, description, priority)
            VALUES (@user_id, @agent_id, @subject, @description, @priority);
            SELECT SCOPE_IDENTITY() AS id;
        `);
    return res.recordset?.[0]?.id ?? null;
};

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
    if (!ticket_id || !agent_id) throw new Error("TicketID and AgendId are required");
    try {
    const pool = await poolPromise;
    await pool.request()
        .input("ticket_id", sql.Int, ticket_id)
        .input("agent_id", sql.Int, agent_id)
        .query(`
            UPDATE sg.ticketing_tickets
            SET agent_id = @agent_id,
                assigned_at = GETDATE(),
                status = 'On Progress'
            WHERE id = @ticket_id
        `);
    return true;
    } catch (error) {
        console.error('DB ERROR(assignTicket):', err)
        throw err;        
    }
};

// Update ticket status
export const updateStatus = async (ticket_id, status) => {
    try {
    const pool = await poolPromise;
    let timestampColumn = null;
    switch (status) {
        case 'On Progress':
            timestampColumn = 'started_at';
            break;
        case 'Resolved':
            timestampColumn = 'resolved_at';
            break;
        case 'Closed':
            timestampColumn = 'closed_at';
            break;
        case 'Cancelled':
            timestampColumn = 'cancelled_at';
            break;
    }

    const query = `
        UPDATE sg.ticketing_tickets
        SET status = @status
        ${timestampColumn ? `, ${timestampColumn} = GETDATE()` : ''}
        WHERE id = @ticket_id
    `;
    console.log('Executing query', query)
    await pool.request()
        .input('ticket_id', sql.Int, ticket_id)
        .input('status', sql.VarChar(20), status)
        .query(query);
    return true;
} catch(err) {
        console.error('DB ERROR:', err)
        throw err;
    }
}
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