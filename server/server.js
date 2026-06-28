import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Make io accessible in routes/controllers
app.set('io', io);

// Socket.io middleware for authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error: No token'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) return next(new Error('Authentication error: User not found'));
    
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
});

const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.name} (${socket.user._id})`);
  
  // Track online users
  onlineUsers.set(socket.user._id.toString(), socket.id);
  io.emit('online_users', Array.from(onlineUsers.keys()));

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.user.name} joined room ${room}`);
  });

  socket.on('leave_room', (room) => {
    socket.leave(room);
  });

  socket.on('typing', ({ room, isTyping }) => {
    socket.to(room).emit('user_typing', { userId: socket.user._id, isTyping });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.name}`);
    onlineUsers.delete(socket.user._id.toString());
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});
