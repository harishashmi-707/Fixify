import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAllTechnicians,
  updateTechnicianStatus,
  getAllBookings,
  updateUser,
  deleteUser,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

// All admin routes are protected
router.use(protect, authorize(ROLES.ADMIN));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/status', toggleUserStatus);
router.get('/technicians', getAllTechnicians);
router.put('/technicians/:id/status', updateTechnicianStatus);
router.get('/bookings', getAllBookings);

export default router;
