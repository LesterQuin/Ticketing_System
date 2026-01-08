import * as Priority from "../../models/admin/ticket_Priority_Model.js"
import { isAlphaSpaceOnly } from "../../utils/validators.js"

/**
 * CREATE PRIORITY
 */
export const createPriority = async (req, res) => {
    try {
        const { priority_name } = req.body;

        if (!priority_name) {
            return res.status(400).json({ message: "priority_name is required." });
        }

        if (!isAlphaSpaceOnly(priority_name)) {
            return res.status(400).json({
                message: "Priority must contain letters and spaces only."
            });
        }

        const priority = await Priority.createPriority(priority_name.trim());

        res.status(201).json({
            success: true,
            priority,
            message: "Priority created successfully."
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
};

/**
 * GET ALL PRIORITIES
 */
export const getPriorities = async (req, res) => {
    try {
        const priorities = await Priority.getAllPriorities();
        res.json({
            success: true,
            priorities
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error."
        });
    }
};

/**
 * GET PRIORITY BY ID
 */
export const getPriority = async (req, res) => {
    try {
        const priority = await Priority.getPriorityById(req.params.id);
        if (!priority)
            return res.status(404).json({
                message: "Priority not found."
        })

        res.json({
            success: true,
            priority
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error."
        })
    }
}

/**
 * UPDATE PRIORITY
 */
export const updatePriority = async (req, res) => {
    try {
        const { priority_name } = req.body;

        if (!priority_name) {
            return res.status(400).json({
                message: "priority_name is required."
            });
        }

        if (!isAlphaSpaceOnly(priority_name)) {
            return res.status(400).json({
                message: "Priority must contain letters and spaces only."
            });
        }

        const priority = await Priority.updatePriority(req.params.id)

        res.json({
            success: true,
            priority,
            message: "Priority updated successfully."
        });

    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Server Error."
        });
    }
};

/**
 * DELETE PRIORITY
 */
export const deletePriority = async (req, res) => {
    try {
        await Priority.deletePriority(res.params.id);
        res.json({
            success: true,
            message: "Priority deleted successfully."
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error."
        });
    }
};