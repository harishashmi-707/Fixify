import Booking from '../models/Booking.js';
import { generateBookingNumber } from '../utils/helpers.js';
import { ROLES, BOOKING_TRANSITIONS } from '../config/constants.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private/User
export const createBooking = async (req, res, next) => {
  try {
    const { technician, service, bookingDate, bookingTime, address, city, phone, description, totalAmount } = req.body;

    const bookingNumber = await generateBookingNumber();

    const booking = await Booking.create({
      bookingNumber,
      user: req.user.id,
      technician,
      service,
      bookingDate,
      bookingTime,
      address,
      city,
      phone,
      description,
      totalAmount,
      statusHistory: [{ status: 'pending', notes: 'Booking created', changedBy: req.user.id }]
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for logged in user/technician
// @route   GET /api/bookings
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    let query = {};
    
    if (req.user.role === ROLES.USER) {
      query.user = req.user.id;
    } else if (req.user.role === ROLES.TECHNICIAN) {
      // Find technician profile ID first
      import('../models/Technician.js').then(async ({ default: Technician }) => {
        const tech = await Technician.findOne({ user: req.user.id });
        if(tech) {
            query.technician = tech._id;
            fetchBookings(query, res, next);
        } else {
             res.status(404).json({ success: false, message: 'Technician profile not found' });
        }
      });
      return;
    } else if (req.user.role === ROLES.ADMIN) {
        // Admins get all
    }

    fetchBookings(query, res, next);
    
  } catch (error) {
    next(error);
  }
};

const fetchBookings = async (query, res, next) => {
     try {
        const bookings = await Booking.find(query)
        .populate('user', 'name email phone avatar')
        .populate({
          path: 'technician',
          populate: { path: 'user', select: 'name email phone avatar' }
        })
        .populate('service', 'name basePrice')
        .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
     } catch (err) {
         next(err);
     }
}

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Role-based authorization to modify this specific booking
    // ... simplified for now

    // Check if transition is valid
    const allowedTransitions = BOOKING_TRANSITIONS[booking.status] || [];
    if (!allowedTransitions.includes(status) && req.user.role !== ROLES.ADMIN) {
        return res.status(400).json({ success: false, message: `Cannot transition from ${booking.status} to ${status}` });
    }

    booking.status = status;
    booking.statusHistory.push({
      status,
      notes,
      changedBy: req.user.id
    });

    if (status === 'completed') {
      booking.completedAt = Date.now();
    }

    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
