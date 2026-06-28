import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, authorize(ROLES.ADMIN), upload.single('image'), createCategory);
router.put('/:id', protect, authorize(ROLES.ADMIN), upload.single('image'), updateCategory);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteCategory);

export default router;
