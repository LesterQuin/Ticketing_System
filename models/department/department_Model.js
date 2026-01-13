// models/departments/department_Model.js
import { poolPromise, sql } from '../../config/db.js' 

// CREATE
export const createDepartment = async (name_department) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input('name_department', sql.VarChar(100), name_department)
        .query(`
            INSERT INTO sg.ticketing_departments (name_department, created_at)
            OUTPUT INSERTED.id_department, INSERTED.name_department
            VALUES (@name_department, GETDATE())
        `);
    return res.recordset[0];
};

// READ ALL
export const getDepartments = async () => {
    const pool = await poolPromise;
    const res = await pool.request()
        .query(`
            SELECT id_department, name_department
            FROM sg.ticketing_departments
            ORDER BY name_department
        `);
    return res.recordset;
}

// UPDATE
export const updateDepartment = async (id_department, name_department) => {
    const pool = await poolPromise;
    const res = await pool.request()
        .input('id_department', sql.Int, id_department)
        .input('name_department', sql.VarChar(100), name_department)
        .query(`
            UPDATE sg.ticketing_departments
            SET name_department = @name_department, updated_at = GETDATE()
            OUTPUT INSERTED.id_department, INSERTED.name_department
            WHERE id_department = @id_department
        `);
    return res.recordset[0];
};

// DELETE
export const deleteDepartment = async (id_department) => {
    const pool = await poolPromise;
    await pool.request()
        .input('id_department', sql.Int, id_department)
        .query(`
            DELETE FROM sg.ticketing_departments
            WHERE id_department = @id_department
        `);
};