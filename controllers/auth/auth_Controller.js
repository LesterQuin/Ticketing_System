// controllers/auth/auth_Controller.js
import * as Model from '../../models/auth/auth_Model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// User registration
export const register = async (req, res) => {
    try {
        console.log('REGISTER CONTROLLER HIT');
        if (!req.body || Object.keys(req.body).length === 0) 
            return res.status(400).json({ message: 'Request body missing' });

        const { first_name, middle_name, last_name, email, password, role } = req.body;

        const existingUser = await Model.getUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'Email already in use' });

        const userId = await Model.createUser({ first_name, middle_name, last_name, email, password, role });

        const token = jwt.sign({ id: userId, role: role || 'user' }, process.env.JWT_SECRET, { expiresIn: '8h' });
        await Model.updateToken(userId, token);

        res.status(201).json({
            success: true,
            user: { id: userId, first_name, middle_name, last_name, email, role: role || 'user' },
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// User login
export const login = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) 
            return res.status(400).json({ message: 'Request body missing' });

        const { email, password } = req.body;
        const user = await Model.getUserByEmail(email);
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
        await Model.updateToken(user.id, token);

        res.status(200).json({
            success: true,
            token,
            user: { id: user.id, first_name: user.first_name, middle_name: user.middle_name, last_name: user.last_name, role: user.role }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all Users
export const getAllUsers = async (req, res) => {
    try {
        const users = await Model.getAllUsers();

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Get Users Error:',error);
        res.status(500).json({ 
            message: 'Users not found'
        });
    }
}

// Get User
export const getUser = async (req, res) => {
    try {
        const user = await Model.getUserById(req.params.id);
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get User Error:',error);
        return res.status(500).json({
            message: 'User not found.'
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        await Model.updateUser(req.params.id, req.body);
        return res.status(200).json({
            success: true,
            message: 'User updated.'
        })
    } catch (error) {
        console.error('User not found')
        res.status(500).json({
            message: 'Server Error.'
        })
    }
}

export const removeUser = async (req, res) => {
    try {
        await Model.deleteUser(req.params.id);
        res.status(200).json({
            success: true,
            message: 'User deleted.'
        })
    } catch (error) {
        console.error('Delete user error:', error)
        return res.status(500).json({
            message: 'Server error.'
        });
    }
}