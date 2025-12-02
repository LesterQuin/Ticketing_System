// server.js
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.LOCAL_SERVER_PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
