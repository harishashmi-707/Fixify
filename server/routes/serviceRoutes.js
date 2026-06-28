import express from 'express';
import { getServices, getServiceBySlug, createService, updateService, deleteService } from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/', getServices);
router.get('/:slug', getServiceBySlug);
router.post('/', protect, authorize(ROLES.ADMIN), upload.single('image'), createService);
router.put('/:id', protect, authorize(ROLES.ADMIN), upload.single('image'), updateService);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteService);

export default router;
