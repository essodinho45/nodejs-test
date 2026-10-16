// tests/tickets.test.js
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('Tickets API', () => {
  let createdTicketId;

  it('POST /api/tickets - should create a ticket with valid data', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .send({ title: 'Login broken', priority: 'high' });
    
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBe('open');
    createdTicketId = res.body.id;
  });

  it('POST /api/tickets - should return 400 for invalid data', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .send({ title: 'Lo', priority: 'high' }); // Title too short
    
    expect(res.status).toBe(400);
    expect(res.body.error.details[0].context.key).toBe('title');
  });

  it('GET /api/tickets - should return paginated list', async () => {
    const res = await request(app).get('/api/tickets?limit=10&page=1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].id).toBe(createdTicketId);
  });
});