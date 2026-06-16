import Service from '../models/Service.js';

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res, next) => {
  try {
    const { category, search, sort = 'name' } = req.query;
    
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const services = await Service.find(query)
      .populate('category', 'name slug icon')
      .sort(sort);
    
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by slug
// @route   GET /api/services/:slug
// @access  Public
export const getServiceBySlug = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug icon');
      
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
export const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};
