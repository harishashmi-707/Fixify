import Message from '../models/Message.js';
import User from '../models/User.js';

// Helper to get room ID (sorted user IDs)
const getRoomId = (id1, id2) => {
  return [id1.toString(), id2.toString()].sort().join('_');
};

// @desc    Get all conversations for logged in user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 })
      .populate('sender', 'name avatar role')
      .populate('receiver', 'name avatar role');

    // Group by conversation partner
    const conversationsMap = new Map();

    messages.forEach(msg => {
      const isSender = msg.sender._id.toString() === userId.toString();
      const partner = isSender ? msg.receiver : msg.sender;
      const partnerId = partner._id.toString();

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          user: partner,
          lastMessage: msg,
          unreadCount: 0
        });
      }

      // Count unread if I am the receiver
      if (!isSender && !msg.isRead) {
        conversationsMap.get(partnerId).unreadCount += 1;
      }
    });

    res.status(200).json({
      success: true,
      data: Array.from(conversationsMap.values())
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages with a specific user
// @route   GET /api/messages/:userId
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;
    const myId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherUserId },
        { sender: otherUserId, receiver: myId }
      ]
    })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/messages/:userId
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const receiverId = req.params.userId;
    const senderId = req.user.id;
    const { text, bookingId } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: text,
      booking: bookingId || null
    });

    // Populate sender info for real-time delivery
    await newMessage.populate('sender', 'name avatar');

    // Emit via Socket.io if available
    const io = req.app.get('io');
    if (io) {
      const room = getRoomId(senderId, receiverId);
      io.to(room).emit('receive_message', newMessage);
      
      // Also notify the receiver directly in case they are not in the room yet
      // but they are online
      // We will handle notifications via socket too
    }

    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all messages from a user as read
// @route   PUT /api/messages/:userId/read
// @access  Private
export const markConversationRead = async (req, res, next) => {
  try {
    const senderId = req.params.userId;
    const myId = req.user.id;

    await Message.updateMany(
      { sender: senderId, receiver: myId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    next(error);
  }
};
