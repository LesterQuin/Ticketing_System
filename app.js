// app.js
import express from 'express';
import authRoutes from './routes/auth/auth_routes.js';

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Ticketing System is Working!")
});

// Mount route modules
app.use('/api/auth', authRoutes);

// You can add more route modules here
// e.g., app.use('/tickets', ticketRoutes);

export default app;
