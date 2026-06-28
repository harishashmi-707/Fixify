import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { tokens, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && tokens?.accessToken) {
      const socketInstance = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', {
        auth: { token: tokens.accessToken }
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected');
      });

      socketInstance.on('online_users', (users) => {
        setOnlineUsers(users);
      });

      socketInstance.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [isAuthenticated, tokens?.accessToken]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
