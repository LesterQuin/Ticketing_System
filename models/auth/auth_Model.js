const { poolPromise, sql } = require('../../config/db');
const bcrypt = require('bcrypt');

const User = {
    // Create a new user
    create: async ({ first_name, middle_name, last_name, email, password, role }) => {
        const pool = await poolPromise;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.request()
            .input('first_name', sql.VarChar(50), first_name)
            .input('middle_name', sql.VarChar(50), middle_name)
            .input('last_name', sql.VarChar(50), last_name)
            .input('email', sql.VarChar(100), email)
            .input('password', sql.VarChar(255), hashedPassword)
            .input('role', sql.VarChar(20), role || 'user')
            .query(`
                INSERT INTO sg.ticketing_users (first_name, middle_name, last_name, email, password, role)
                VALUES (@first_name, @middle_name, @last_name, @email, @password, @role);
                SELECT SCOPE_IDENTITY() AS id;
            `);

        return result.recordset[0].id;
    },

    // Get user by email (for login)
    getByEmail: async (email) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.VarChar(100), email)
            .query('SELECT * FROM sg.ticketing_users WHERE email = @email');
        return result.recordset[0];
    }
};

module.exports = User;
