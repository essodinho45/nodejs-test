import express from 'express';
import cors from 'cors';
import ticketRoutes from './routes/tickets.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/tickets', ticketRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${status}: ${err.message}`);

  res.status(status).json({
    error: {
      message: status === 500 ? 'Internal Server Error' : message,
      ...(err.details && { details: err.details })
    }
  });
});

export default app;

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}