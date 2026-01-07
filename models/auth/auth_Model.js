import { poolPromise, sql } from '../../config/db.js';
import bcrypt from 'bcrypt';

export const createUser = async ({ first_name, middle_name, last_name, email, password, role }) => {
    const pool = await poolPromise;
    const hashedPassword = await bcrypt.hash(password, 10);

    const res = await pool.request()
        .input('first_name', sql.VarChar(50), first_name)
        .input('middle_name', sql.VarChar(50), middle_name ?? null)
        .input('last_name', sql.VarChar(50), last_name)
        .input('email', sql.VarChar(100), email)
        .input('password', sql.VarChar(255), hashedPassword)
        .input('role', sql.VarChar(20), role || 'user')
        .query(`
            INSERT INTO sg.ticketing_users (first_name, middle_name, last_name, email, password, role)
            VALUES (@first_name, @middle_name, @last_name, @email, @password, @role);
            SELECT SCOPE_IDENTITY() AS id;
        `);

    return res.recordset?.[0]?.id ?? null;
};

export const getUserByEmail = async (email) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input('email', sql.VarChar(100), email)
        .query(`
            SELECT
                id,
                first_name,
                middle_name,
                last_name,
                email,
                password,
                role,
                token
            FROM sg.ticketing_users
            WHERE email = @email
        `);
    return res.recordset[0] ?? null;
};

export const getAllUsers = async () => {
    const pool = await poolPromise;
    const res = await pool.request()
        .query(`
            SELECT
                id,
                first_name,
                middle_name,
                last_name,
                email,
                role,
                created_at
            FROM sg.ticketing_users
            ORDER BY created_at DESC
        `);

    return res.recordset;
}

export const getUserById = async (id) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input('id', sql.Int, id)
        .query(`
            SELECT
                id,
                first_name,
                middle_name,
                last_name,
                email,
                role,
                created_at
            FROM sg.ticketing_users
            WHERE id= @id
        `);
    return res.recordset[0] ?? null;
};

export const updateUser = async (id, data) => {
    const pool = await poolPromise;

    await pool.request()
        .input('id', sql.Int, id)
        .input('first_name', sql.VarChar(50), data.first_name)
        .input('middle_name', sql.VarChar(50), data.middle_name ?? null)
        .input('last_name', sql.VarChar(50), data.last_name)
        .input('role', sql.VarChar(20), data.role)
        .query(`
            UPDATE sg.ticketing_users
            SET
                first_name = @first_name,
                middle_name = @middle_name,
                last_name = @last_name,
                role = @role,
            WHERE id = @id
        `);
};

export const updateToken = async (userId, token) => {
    const pool = await poolPromise;
    await pool.request()
        .input('id', sql.Int, userId)
        .input('token', sql.VarChar(500), token)
        .query(`UPDATE sg.ticketing_users SET token = @token WHERE id = @id`);
};

export const deleteUser = async (id) => {
    const pool = await poolPromise;
    await pool.request()
        .input('id', sql.Int, id)
        .query(`
            DELETE 
            FROM sg.ticketing_users
            WHERE id = @id
        `);
};