import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Technician from '../models/Technician.js';
import { ROLES } from '../config/constants.js';

// Helper: recalculate technician rating
const recalcTechRating = async (technicianId) => {
  const reviews = await Review.find({ technician: technicianId, isVisible: true });
  const total = reviews.length;
  const avg = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
  await Technician.findByIdAndUpdate(technicianId, { avgRating: parseFloat(avg.toFixed(2)), totalReviews: total });
};

// @desc    Create a review for a completed booking
// @route   POST /api/reviews
// @access  Private/User
export const createReview = async (req, res, next) => {
  try {
    const { booking: bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only review your own bookings' });
    }
    if (booking.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'You can only review completed bookings' });
    }

    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this booking' });
    }

    const review = await Review.create({
      booking: bookingId,
      user: req.user.id,
      technician: booking.technician,
      rating,
      comment,
    });

    await recalcTechRating(booking.technician);

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a technician
// @route   GET /api/reviews/technician/:techId
// @access  Public
export const getReviewsForTechnician = async (req, res, next) => {
  try {
    const reviews = await Review.find({ technician: req.params.techId, isVisible: true })
      .populate('user', 'name avatar')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a review (technician only)
// @route   PUT /api/reviews/:id/reply
// @access  Private/Technician
export const replyToReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Verify the technician owns this review
    const tech = await Technician.findOne({ user: req.user.id });
    if (!tech || tech._id.toString() !== review.technician.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to reply to this review' });
    }

    review.reply = req.body.reply;
    review.replyAt = Date.now();
    await review.save();

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews by the logged-in user
// @route   GET /api/reviews/me
// @access  Private/User
export const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate({
        path: 'technician',
        populate: { path: 'user', select: 'name avatar' }
      })
      .populate('booking', 'bookingNumber service')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};
