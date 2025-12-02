// app.js
import express from 'express';
import authRoutes from './routes/auth/auth_routes.js';

const app = express();

app.use(express.json());

// Mount route modules
app.use('/auth', authRoutes);

// You can add more route modules here
// e.g., app.use('/tickets', ticketRoutes);

export default app;
