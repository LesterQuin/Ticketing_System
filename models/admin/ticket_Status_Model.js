import { poolPromise, sql } from "../../config/db.js";

/**
 * Create status
 */
export const createStatus = async (status_name) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input("status_name", sql.VarChar(50), status_name)
        .query(`
            INSERT INTO sg.ticketing_status (status_name)
            VALUES (@status_name);

            SELECT * FROM sg.ticketing_status
            WHERE id = SCOPE_IDENTITY();
        `);

    return res.recordset?.[0] ?? null;
};

/**
 * Get status by statuses
 */
export const getAllStatuses = async () => {
    const pool = await poolPromise;
    const res = await pool.request()
        .query(`
            SELECT  *
            FROM sg.ticketing_status
            ORDER BY id
        `);
    return res.recordset;
}

/**
 * Get status by ID
 */
export const getStatusById = async (id) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input("id", sql.Int, id)
        .query(`
            SELECT *
            FROM sg.ticketing_status
            WHERE id = @id
        `);
    return res.recordset?.[0] ?? null;
};

/**
 * Update status
 */
export const updateStatus = async (id, status_name) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input("id", sql.Int, id)
        .input("status_name", sql.VarChar(50), status_name)
        .query(`
            UPDATE sg.ticketing_status
            SET status_name = @status_name
            WHERE id = @id
            
            SELECT * 
            FROM sg.ticketing_status
            WHERE id = @id
        `);
    return res.recordset?.[0] ?? null;
};

/**
 * Delete status
 */
export const deleteStatus = async (id) => {
    const pool = await poolPromise;
    await pool.request()
        .input("id", sql.Int, id)
        query(`
            DELETE FROM sg.ticketing_status
            WHERE id = @id
        `);
    return true;
};