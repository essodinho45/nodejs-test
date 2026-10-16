// src/server.js
import express from 'express';
import cors from 'cors';
import ticketRoutes from './routes/tickets.js';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tickets', ticketRoutes);

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Centralized Error Handler (Requirement 6: No stack traces leaked)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log the actual error for debugging, but hide it from the client if it's a 500
  console.error(`[Error] ${status}: ${err.message}`);
  
  res.status(status).json({
    error: {
      message: status === 500 ? 'Internal Server Error' : message,
      // Pass along validation details if present
      ...(err.details && { details: err.details })
    }
  });
});

export default app; // Export app for testing

// Only start the server if this file is run directly (not imported by tests)
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}