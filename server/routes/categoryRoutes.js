import express from 'express';
import { getCategories, createCategory } from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, authorize(ROLES.ADMIN), createCategory);

export default router;
