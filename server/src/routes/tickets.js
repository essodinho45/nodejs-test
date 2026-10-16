// src/routes/tickets.js
import { Router } from 'express';
import crypto from 'crypto';
import Joi from 'joi';
import createError from 'http-errors';

const router = Router();

// In-memory storage (Requirement 7)
let tickets = [];

// Validation Schemas
const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10), // Cap limit at 50
  status: Joi.string().valid('open', 'in_progress', 'closed'),
  q: Joi.string().allow('')
});

const createTicketSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(1000).allow('').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').required()
});

const updateTicketSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().max(1000).allow(''),
  priority: Joi.string().valid('low', 'medium', 'high'),
  status: Joi.string().valid('open', 'in_progress', 'closed')
}).min(1); // Require at least one field to update

// GET /api/tickets
router.get('/', (req, res, next) => {
  try {
    const { error, value } = querySchema.validate(req.query);
    if (error) throw createError(400, 'Invalid query parameters', { details: error.details });

    const { page, limit, status, q } = value;

    // Filter
    let filtered = tickets;
    if (status) {
      filtered = filtered.filter(t => t.status === status);
    }
    if (q) {
      const searchLower = q.toLowerCase();
      filtered = filtered.filter(t => t.title.toLowerCase().includes(searchLower));
    }

    // Sort newest first
    filtered.sort((a, b) => b.createdAt - a.createdAt);

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginated = filtered.slice(startIndex, endIndex);

    res.json({
      data: paginated,
      total: filtered.length,
      page,
      limit
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/tickets
router.post('/', (req, res, next) => {
  try {
    const { error, value } = createTicketSchema.validate(req.body);
    if (error) throw createError(400, 'Validation failed', { details: error.details });

    const newTicket = {
      id: crypto.randomUUID(),
      ...value,
      status: 'open', // Default status
      createdAt: Date.now()
    };

    tickets.push(newTicket);
    res.status(201).json(newTicket);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tickets/:id
router.patch('/:id', (req, res, next) => {
  try {
    const ticketIndex = tickets.findIndex(t => t.id === req.params.id);
    if (ticketIndex === -1) throw createError(404, 'Ticket not found');

    const { error, value } = updateTicketSchema.validate(req.body);
    if (error) throw createError(400, 'Validation failed', { details: error.details });

    tickets[ticketIndex] = { ...tickets[ticketIndex], ...value };
    res.json(tickets[ticketIndex]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tickets/:id
router.delete('/:id', (req, res, next) => {
  try {
    const ticketIndex = tickets.findIndex(t => t.id === req.params.id);
    if (ticketIndex === -1) throw createError(404, 'Ticket not found');

    tickets.splice(ticketIndex, 1);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;