// controllers/departments/department_Controller.js
import e from 'express';
import * as Model from '../../models/department/department_Model.js';

// CREATE
export const createDepartment = async (req, res) => {
    try {
        console.log("req.body:", req.body);
        const  { name_department } = req.body;
        if (!name_department) return res.status(400).json({
            message: 'Name was required.'
        })

        const department = await Model.createDepartment(name_department);

        res.status(201).json({
            success: true,
            message: 'Department created.',
            department
        });

    } catch (error) {
        console.error('Create Department Error:', error);
        res.status(500).json({
            message: 'Server Error.'
        });
    }
};

// READ ALL
export const getDepartments = async (req, res) => {
    try {
        const departments = await Model.getDepartments();
        res.status(200).json({
            success: true,
            departments
        });
    } catch (error) {
        console.error('Get Department Error:', error);
        res.status(500).json({
            message: 'Server Error.'
        });
    }
};

// UPDATE
export const updateDepartment = async (req, res) => {
    try {
        const { name_department } = req.body;
        if (!name_department) return res.status(400).json({
            message: 'Name is required'
        });

        const department = await Model.updateDepartment(req.params.id, name_department);
        if (!department) return res.status(404).json({
            message: 'Department not found.'
        });

        res.status(200).json({
            success: true,
            message: 'Department updated.',
            department
        });
    } catch (error) {
        console.error('Update Department Error:', error);
        res.status(500).json({
            message: 'Server Error.'
        });
    }
};

// DELETE
export const deleteDepartment = async (req, res) => {
    try {
        await Model.deleteDepartment(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Department deleted successfully.'
        });
    } catch (error) {
        console.error('Delete Department Error:', error);
        res.status(500).json({
            message: 'Server Error.'
        });
    }
};