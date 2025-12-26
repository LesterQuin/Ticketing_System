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

// Get Users
export const users = async (req, res) => {
    try {
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'user not found'});
    }
}