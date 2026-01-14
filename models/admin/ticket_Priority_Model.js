import { poolPromise, sql } from "../../config/db.js";

/**
 * Create a priority
 */
export const createPriority = async (priority_name) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input("priority_name", sql.VarChar(20), priority_name)
        .query(`
            INSERT INTO sg.ticketing_priority (priority_name)
            VALUES (@priority_name)
        `);
    return res.recordset?.[0] ?? null;
};

/**
 * Get all priorities
 */
export const getAllPriorities = async () => {
    const pool = await poolPromise;
    const res = await pool.request()
        .query(`
            SELECT *
            FROM sg.ticketing_priority
            ORDER BY id`);

    return res.recordset;
};

/**
 * Get priority by ID
 */
export const getPriorityById = async (id) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input("id", sql.Int, id)
        .query(`
            SELECT * 
            FROM sg.ticketing_priority
            WHERE id = @id
        `);
    return res.recordset?.[0] ?? null;
};

/**
 * Update priority
 */
export const updatePriority = async (id, priority_name) => {
    const pool = await poolPromise;
    const res  = await pool.request()
        .input("id", sql.Int, id)
        .input("priority_name", sql.VarChar(20), priority_name)
        .query(`
            UPDATE sg.ticketing_priority
            SET priority_name = @priority_name
            WHERE id = @id
        `)
    return res.recordset?.[0] ?? null;
};

/**
 * Delete priority
 */
export const deletePriority = async (id) => {
    const pool = await poolPromise;
    await pool.request()
        .input("id", sql.Int, id)
        .query(`
            DELETE 
            FROM sg.ticketing_priority
            WHERE id = @id
        `)
    return true;
};