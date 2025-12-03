// server.js
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

// Test route
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello, it's working" });
});

const PORT = process.env.LOCAL_SERVER_PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
