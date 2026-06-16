import Technician from '../models/Technician.js';
import User from '../models/User.js';

// @desc    Get all approved technicians
// @route   GET /api/technicians
// @access  Public
export const getTechnicians = async (req, res, next) => {
  try {
    const { city, search } = req.query;
    
    // First find matching users if there's a city or search query
    let userQuery = { role: 'technician', isActive: true };
    if (city) {
      userQuery.city = { $regex: city, $options: 'i' };
    }
    if (search) {
      userQuery.name = { $regex: search, $options: 'i' };
    }
    
    let userIds = [];
    if (city || search) {
       const users = await User.find(userQuery).select('_id');
       userIds = users.map(u => u._id);
    }

    let techQuery = { status: 'approved' };
    
    if (city || search) {
      techQuery.user = { $in: userIds };
    }

    const technicians = await Technician.find(techQuery)
      .populate('user', 'name email phone avatar city')
      .populate('services.service', 'name basePrice')
      .sort('-avgRating');

    res.status(200).json({
      success: true,
      count: technicians.length,
      data: technicians,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get technician by ID
// @route   GET /api/technicians/:id
// @access  Public
export const getTechnicianById = async (req, res, next) => {
  try {
    const technician = await Technician.findById(req.params.id)
      .populate('user', 'name email phone avatar city')
      .populate('services.service', 'name basePrice');

    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }

    res.status(200).json({
      success: true,
      data: technician,
    });
  } catch (error) {
    next(error);
  }
};
