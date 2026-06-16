import express from 'express';
import { getTechnicians, getTechnicianById } from '../controllers/technicianController.js';

const router = express.Router();

router.get('/', getTechnicians);
router.get('/:id', getTechnicianById);

export default router;
