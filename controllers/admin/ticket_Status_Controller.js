import * as Status from "../../models/admin/ticket_Status_Model.js";
import { isAlphaSpaceOnly } from "../../utils/validators.js";

/**
 * Create Status (ADMIN)
 */
export const createStatus = async (req, res) => {
    try {
        const { status_name } = req.body;

        if (!status_name){
            return res.status(400).json({
                message: "Status name is required."
            });
        }

        if (!isAlphaSpaceOnly(status_name)) {
            return res.status(400).json({
                message: "Status name must contain letters and spaces only"
            });
        }

        const status = await Status.createStatus(status_name.trim());

        res.status(201).json({
            success: true,
            status,
            message: "Status created successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error."
        });
    }
};

/**
 * List statuses
 */
export const getStatuses = async (req, res) => {
    try {
        const statuses = await Status.getAllStatuses();
        res.json({
            message: true,
            statuses
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error."
        });
    }
};

/**
 * Get status by ID
 */
export const getStatus = async (req, res) => {
    try {
        const status = await Status.getStatusById(req.params.id);

        if (!status) {
            return res.status(404).json ({
                message: "Status not found."
            })
        }

        res.json({
            success: true,
            status
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error."
        });
    }
};

/**
 * Update status
 */
export const updateStatus = async (req, res) => {
    try {
        const { status_name } = req.body;

        if (!status_name) {
            return res.status(400).json({
                message: "status_name is required."
            });
        }

        if (!isAlphaSpaceOnly(status_name)) {
            return res.status(400).json({
                message: "Status name must contain letter and spaces only."
            });
        }

        const status = await Status.updateStatus(
            req.params.id,
            status_name.trim()
        );

        res.json({
            success: true,
            status,
            message: "Status updated successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error."
        });
    }
};

/**
 * Delete status
 */
export const deleteStatus = async (req, res) => {
    try {
        await Status.deleteStatus(req.params.id);

        res.json({
            success:true,
            message: "Status deleted successfully"
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error."
        });
    }
};