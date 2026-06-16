import express from 'express';
import { createReview, getReviewsForTechnician, replyToReview, getMyReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/me', protect, getMyReviews);
router.get('/technician/:techId', getReviewsForTechnician);
router.put('/:id/reply', protect, replyToReview);

export default router;
