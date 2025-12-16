// ticket/ticket_Model.js
import { pool } from "mssql";
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