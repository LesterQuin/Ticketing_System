// app.js
import express from 'express';
import authRoutes from './routes/auth/auth_routes.js';
import ticketRoutes from './routes/ticket/ticket_routes.js'
import ticketStatusRoutes from './routes/admin/ticket_Status_Routes.js'

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Ticketing System is Working!")
});

// Mount route modules
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/ticket-status', ticketStatusRoutes);

export default app;
