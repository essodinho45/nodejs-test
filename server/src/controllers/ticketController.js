import { Ticket } from '../models/Ticket.js';
import Joi from 'joi';
import createError from 'http-errors';

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
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
}).min(1);

export const getTickets = (req, res, next) => {
  try {
    const { error, value } = querySchema.validate(req.query);
    if (error) throw createError(400, 'Invalid parameters', { details: error.details });

    const { data, total } = Ticket.findAll(value);

    res.json({
      data,
      total,
      page: value.page,
      limit: value.limit
    });
  } catch (err) {
    next(err);
  }
};

export const createTicket = (req, res, next) => {
  try {
    const { error, value } = createTicketSchema.validate(req.body);
    if (error) throw createError(400, 'Validation failed', { details: error.details });

    const newTicket = Ticket.create(value);
    res.status(201).json(newTicket);
  } catch (err) {
    next(err);
  }
};

export const updateTicket = (req, res, next) => {
  try {
    const { error, value } = updateTicketSchema.validate(req.body);
    if (error) throw createError(400, 'Validation failed', { details: error.details });

    const updated = Ticket.update(req.params.id, value);
    if (!updated) throw createError(404, 'Ticket not found');

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteTicket = (req, res, next) => {
  try {
    const success = Ticket.delete(req.params.id);
    if (!success) throw createError(404, 'Ticket not found');

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};