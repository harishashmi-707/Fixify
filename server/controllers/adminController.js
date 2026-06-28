import User from '../models/User.js';
import Technician from '../models/Technician.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import ContactMessage from '../models/ContactMessage.js';
import Review from '../models/Review.js';
import { ROLES } from '../config/constants.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalTechnicians,
      totalBookings,
      pendingApprovals,
      unreadMessages,
      disputedBookings,
    ] = await Promise.all([
      User.countDocuments({ role: ROLES.USER }),
      Technician.countDocuments(),
      Booking.countDocuments(),
      Technician.countDocuments({ status: 'pending' }),
      ContactMessage.countDocuments({ status: 'unread' }),
      Booking.countDocuments({ status: 'disputed' }),
    ]);

    // Calculate revenue from completed bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // Monthly revenue for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRevenue = await Booking.aggregate([
      { $match: { status: 'completed', completedAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$completedAt' } },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalTechnicians,
        totalBookings,
        totalRevenue,
        pendingApprovals,
        unreadMessages,
        disputedBookings,
        monthlyRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, phone, role, city, address, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role, city, address, isActive },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete associated data
    if (user.role === ROLES.TECHNICIAN) {
      await Technician.findOneAndDelete({ user: user._id });
    }
    await Booking.deleteMany({ user: user._id });
    // More complex deletion logic could be handled via mongoose middleware

    await user.deleteOne();

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all technicians (admin view with all statuses)
// @route   GET /api/admin/technicians
// @access  Private/Admin
export const getAllTechnicians = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status) query.status = status;

    let techQuery = { ...query };

    if (search) {
      const users = await User.find({
        role: ROLES.TECHNICIAN,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ]
      }).select('_id');
      techQuery.user = { $in: users.map(u => u._id) };
    }

    const technicians = await Technician.find(techQuery)
      .populate('user', 'name email phone avatar city isActive createdAt')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: technicians.length, data: technicians });
  } catch (error) {
    next(error);
  }
};

// @desc    Update technician status (approve/reject/suspend)
// @route   PUT /api/admin/technicians/:id/status
// @access  Private/Admin
export const updateTechnicianStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected', 'suspended'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const technician = await Technician.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email phone avatar city');

    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }

    res.status(200).json({ success: true, data: technician });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query.bookingNumber = { $regex: search, $options: 'i' };

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone avatar')
      .populate({
        path: 'technician',
        populate: { path: 'user', select: 'name email phone avatar' }
      })
      .populate('service', 'name basePrice')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};
