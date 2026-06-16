import express from 'express';
import { submitContact, getContactMessages, updateContactStatus } from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', protect, authorize(ROLES.ADMIN), getContactMessages);
router.put('/:id', protect, authorize(ROLES.ADMIN), updateContactStatus);

export default router;
