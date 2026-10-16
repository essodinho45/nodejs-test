import { Router } from 'express';
import * as ticketController from '../controllers/ticketController.js';

const router = Router();

router.get('/', ticketController.getTickets);
router.post('/', ticketController.createTicket);
router.patch('/:id', ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);

export default router;