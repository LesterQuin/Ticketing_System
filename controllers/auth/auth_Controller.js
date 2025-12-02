const User = require('../../models/auth/auth_Model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { first_name, middle_name, last_name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.getByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'Email already in use' });

        const userId = await User.create({ first_name, middle_name, last_name, email, password, role });

        res.status(201).json({ success: true, userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.getByEmail(email);
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.json({ success: true, token, user: { id: user.id, first_name: user.first_name, last_name: user.last_name, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login };
