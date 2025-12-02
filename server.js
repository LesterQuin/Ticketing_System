const express = require('express');
require('dotenv').config();
const { poolPromise } = require('./config/db');
const authRoutes = require('./routes/auth/auth_routes');

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('Ticketing system API is running'));

const PORT = process.env.LOCAL_SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
