import crypto from 'crypto';

// Our in-memory "database"
let tickets = [];

export const Ticket = {
  find: () => {
    return tickets;
  },
  
  findById: (id) => {
    return tickets.find(t => t.id === id);
  },

  create: (data) => {
    const newTicket = {
      id: crypto.randomUUID(),
      ...data,
      status: 'open',
      createdAt: Date.now()
    };
    tickets.push(newTicket);
    return newTicket;
  },

  update: (id, data) => {
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    tickets[index] = { ...tickets[index], ...data };
    return tickets[index];
  },

  delete: (id) => {
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    tickets.splice(index, 1);
    return true;
  }
};