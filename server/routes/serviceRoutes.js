import express from 'express';
import { getServices, getServiceBySlug, createService } from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.get('/', getServices);
router.get('/:slug', getServiceBySlug);
router.post('/', protect, authorize(ROLES.ADMIN), createService);

export default router;
