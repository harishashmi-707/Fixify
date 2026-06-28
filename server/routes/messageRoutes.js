import express from 'express';
import { getConversations, getMessages, sendMessage, markConversationRead } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All message routes are protected
router.use(protect);

router.get('/conversations', getConversations);
router.get('/:userId', getMessages);
router.post('/:userId', sendMessage);
router.put('/:userId/read', markConversationRead);

export default router;
