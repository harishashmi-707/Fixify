import express from 'express';
import { getTechnicians, getTechnicianById, updateMyProfile } from '../controllers/technicianController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/', getTechnicians);
router.put('/profile', protect, authorize(ROLES.TECHNICIAN), updateMyProfile);
router.get('/:id', getTechnicianById);

export default router;
