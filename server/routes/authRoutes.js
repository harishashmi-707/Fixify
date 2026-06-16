import express from 'express';
import { register, login, getMe, refreshToken, updateProfile, changePassword, uploadAvatar } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.put('/avatar', protect, upload.single('avatar'), uploadAvatar);

export default router;
