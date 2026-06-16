import ContactMessage from '../models/ContactMessage.js';

// @desc    Submit a contact form message
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    const contact = await ContactMessage.create({ name, email, phone, subject, message });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon.',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages (admin)
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const messages = await ContactMessage.find(query).sort('-createdAt');

    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact message status (admin)
// @route   PUT /api/contact/:id
// @access  Private/Admin
export const updateContactStatus = async (req, res, next) => {
  try {
    const { status, adminReply } = req.body;

    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (status) msg.status = status;
    if (adminReply) msg.adminReply = adminReply;
    await msg.save();

    res.status(200).json({ success: true, data: msg });
  } catch (error) {
    next(error);
  }
};
