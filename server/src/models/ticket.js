import { DatabaseSync } from 'node:sqlite';
import crypto from 'crypto';

const dbPath = process.env.NODE_ENV === 'test' ? ':memory:' : './tickets.db';
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    priority TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    createdAt INTEGER NOT NULL
  )
`);

export const Ticket = {
  findAll: ({ status, q, page = 1, limit = 10 }) => {
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (q) {
      conditions.push('LOWER(title) LIKE ?');
      params.push(`%${q.toLowerCase()}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countStmt = db.prepare(`SELECT COUNT(*) as total FROM tickets ${whereClause}`);
    const { total } = countStmt.get(...params);

    const offset = (page - 1) * limit;
    const dataStmt = db.prepare(`
      SELECT * FROM tickets
      ${whereClause}
      ORDER BY createdAt DESC
      LIMIT ? OFFSET ?
    `);
    const data = dataStmt.all(...params, limit, offset);

    return { data, total };
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM tickets WHERE id = ?');
    return stmt.get(id) || null;
  },

  create: ({ title, description = '', priority }) => {
    const newTicket = {
      id: crypto.randomUUID(),
      title,
      description,
      priority,
      status: 'open',
      createdAt: Date.now()
    };

    const stmt = db.prepare(`
      INSERT INTO tickets (id, title, description, priority, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      newTicket.id,
      newTicket.title,
      newTicket.description,
      newTicket.priority,
      newTicket.status,
      newTicket.createdAt
    );

    return newTicket;
  },

  update: (id, updates) => {
    const existing = Ticket.findById(id);
    if (!existing) return null;

    const updatedTicket = { ...existing, ...updates };

    const stmt = db.prepare(`
      UPDATE tickets
      SET title = ?, description = ?, priority = ?, status = ?
      WHERE id = ?
    `);

    stmt.run(
      updatedTicket.title,
      updatedTicket.description,
      updatedTicket.priority,
      updatedTicket.status,
      id
    );

    return updatedTicket;
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM tickets WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
};