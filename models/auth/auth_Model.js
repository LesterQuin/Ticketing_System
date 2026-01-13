import { poolPromise, sql } from '../../config/db.js';
import bcrypt from 'bcrypt';

// ----------------- CREATE USER -----------------
export const createUser = async ({ email, password, role }) => {
    const pool = await poolPromise;
    const hashedPassword = await bcrypt.hash(password, 10);

    const res = await pool.request()
        .input('email', sql.VarChar(100), email)
        .input('password', sql.VarChar(255), hashedPassword)
        .input('role', sql.VarChar(20), role || 'user')
        .query(`
            INSERT INTO sg.ticketing_users (email, password, role)
            VALUES (@email, @password, @role);
            SELECT SCOPE_IDENTITY() AS id; 
        `);

    return res.recordset?.[0]?.id ?? null;
};

// ----------------- CREATE PROFILE -----------------
export const createProfile = async (userId, { first_name, middle_name, last_name }) => {
    const pool = await poolPromise;
    await pool.request()
        .input('user_id', sql.Int, userId)
        .input('first_name', sql.VarChar(50), first_name)
        .input('middle_name', sql.VarChar(50), middle_name ?? null)
        .input('last_name', sql.VarChar(50), last_name)
        .query(`
            INSERT INTO sg.ticketing_user_profiles (user_id, first_name, middle_name, last_name, created_at)
            VALUES (@user_id, @first_name, @middle_name, @last_name, GETDATE())
        `);
};

// ----------------- GET USER BY EMAIL -----------------
export const getUserByEmail = async (email) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input('email', sql.VarChar(100), email)
        .query(`
            SELECT
                id,
                email,
                password,
                role,
                token
            FROM sg.ticketing_users
            WHERE email = @email
        `);
    return res.recordset[0] ?? null;
};

// ----------------- GET PROFILE -----------------
export const getProfileByUserId = async (userId) => {
    if (!userId) throw new Error ('User ID is required')

    const pool = await poolPromise;
    const res = await pool.request()
        .input('user_id', sql.Int, userId)
        .query(`
            SELECT *
            FROM sg.ticketing_user_profiles
            WHERE user_id = @user_id
        `);

    return res.recordset[0] ?? null;
}

// ----------------- UPDATE PROFILE -----------------
export const updateProfile = async (userId, data) => {
    const pool = await poolPromise;
    await pool.request()
        .input('user_id', sql.Int, userId)
        .input('first_name', sql.VarChar(50), data.first_name)
        .input('middle_name', sql.VarChar(50), data.middle_name ?? null)
        .input('last_name', sql.VarChar(50), data.last_name) // fix here
        .input('department', sql.VarChar(100), data.department ?? null)
        .input('phone', sql.VarChar(20), data.phone ?? null)
        .input('birthday', sql.Date, data.birthday ?? null)
        .input('address', sql.VarChar(255), data.address ?? null)
        .query(`
            UPDATE sg.ticketing_user_profiles
            SET first_name = @first_name,
                middle_name = @middle_name,
                last_name = @last_name,
                department = @department,
                birthday = @birthday,
                phone = @phone,
                address = @address,
                updated_at = GETDATE()
            WHERE user_id = @user_id
        `);
};

// ----------------- GET ALL USERS WITH PROFILE -----------------
export const getAllUsersWithProfiles = async () => {
    const pool = await poolPromise;
    const res = await pool.request()
        .query(`
            SELECT u.id, u.email, u.role, u.created_at,
                    p.first_name, p.middle_name, p.last_name, p.department
            FROM sg.ticketing_users u
            LEFT JOIN sg.ticketing_user_profiles p ON u.id = p.user_id
            ORDER BY u.created_at DESC
        `);
    return res.recordset;
};

// ----------------- GET USER WITH PROFILE -----------------
export const getUserWithProfileById = async (id) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input('id', sql.Int, id)
        .query(`
            SELECT u.id, u.email, u.role, u.created_at,
                    p.first_name, p.middle_name, p.last_name, p.department, p.birthday, p.phone, p.address
            FROM sg.ticketing_users u
            LEFT JOIN sg.ticketing_user_profiles p ON u.id = p.user_id
            WHERE u.id=@id
        `);
    return res.recordset[0] ?? null;
};

// ----------------- UPDATE USER (Admin) -----------------
export const updateUser = async (id, date) => {
    const pool = await poolPromise;
    await pool.request()
        .input('id', sql.Int, id)
        .input('email', sql.VarChar(100), data.email)
        .input('role', sql.VarChar(50), data.role)
        .query(`
            UPDATE sg.ticketing_users
            SET email = @email, role = @role, updated_at = GETDATE()
            WHERE id = @id
        `);
};

// ----------------- DELETE USER -----------------
export const deleteUser = async (id) => {
    const pool = await poolPromise;
    await pool.request()
        .input('id', sql.Int, id)
        .query(`
            DELETE FROM sg.ticketing_users
            WHERE id = @id
        `);
};

// ----------------- GET USER WITH PASSWORD -----------------
export const getUserByIdWithPassword = async (id) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input('id', sql.Int, id)
        .query(`
            SELECT id, password
            FROM sg.ticketing_users
            WHERE id = @id
        `);
    return res.recordset[0] ?? null;
};

// ----------------- UPDATE PASSWORD -----------------
export const updatePassword = async (id, hashedPassword) => {
    const pool = await poolPromise;
    await pool.request()
        .input('id', sql.Int, id)
        .input('password', sql.VarChar(255), hashedPassword)
        .query(`
            UPDATE sg.ticketing_users
            SET password = @password, updated_at=GETDATE()
            WHERE id = @id
        `);
};

// ----------------- UPDATE TOKEN -----------------
export const updateToken = async (userId, token) => {
    const pool = await poolPromise;
    await pool.request()
        .input('id', sql.Int, userId)
        .input('token', sql.VarChar(500), token)
        .query(`
            UPDATE sg.ticketing_users 
            SET token = @token 
            WHERE id = @id
        `);
};

// ----------------- LOGOUT -----------------
export const logoutUser = async (userId) => {
    const pool = await poolPromise;
    await pool.request()
        .input('id', sql.Int, userId)
        .query(`
            UPDATE sg.ticketing_users
            SET token = NULL
            WHERE id = @id
        `);
};