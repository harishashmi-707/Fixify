import React, { useState, useEffect, useRef } from 'react';
import { Send, User as UserIcon, Search, Plus, MessageCircle } from 'lucide-react';
import { api, useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { getAvatarUrl } from '../../utils/uploadUrl';
import toast from 'react-hot-toast';

const TechMessages = () => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // New Chat
  const [showNewChat, setShowNewChat] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.user._id);
      markAsRead(activeChat.user._id);
      
      const roomId = [user._id, activeChat.user._id].sort().join('_');
      socket?.emit('join_room', roomId);
      
      return () => {
        socket?.emit('leave_room', roomId);
      };
    }
  }, [activeChat]);

  useEffect(() => {
    if (!socket) return;
    
    const handleReceiveMessage = (msg) => {
      if (activeChat && (msg.sender._id === activeChat.user._id || msg.sender === activeChat.user._id)) {
        setMessages(prev => [...prev, msg]);
        markAsRead(activeChat.user._id);
      } else {
        fetchConversations();
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => socket.off('receive_message', handleReceiveMessage);
  }, [socket, activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await api.get(`/messages/${userId}`);
      setMessages(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const markAsRead = async (userId) => {
    try {
      await api.put(`/messages/${userId}/read`);
      setConversations(prev => prev.map(c => 
        c.user._id === userId ? { ...c, unreadCount: 0 } : c
      ));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      const res = await api.post(`/messages/${activeChat.user._id}`, { text: newMessage });
      setMessages(prev => [...prev, res.data.data]);
      setNewMessage('');
      fetchConversations();
    } catch (e) {
      toast.error('Failed to send message');
    }
  };

  // Search users (bookings' customers) for new chat
  const searchUsers = async (query) => {
    setUserSearch(query);
    if (query.length < 1) {
      setSearchResults([]);
      return;
    }
    setSearchingUsers(true);
    try {
      // Technicians can only see their booking customers
      // We fetch bookings and extract unique users
      const res = await api.get('/bookings');
      const bookings = res.data.data || [];
      const usersMap = new Map();
      bookings.forEach(b => {
        if (b.user && b.user.name.toLowerCase().includes(query.toLowerCase())) {
          usersMap.set(b.user._id, b.user);
        }
      });
      const existingIds = conversations.map(c => c.user._id);
      setSearchResults(Array.from(usersMap.values()).filter(u => !existingIds.includes(u._id)));
    } catch (e) {
      console.error(e);
    } finally {
      setSearchingUsers(false);
    }
  };

  const startNewChat = (u) => {
    setActiveChat({
      user: { _id: u._id, name: u.name, avatar: u.avatar, role: u.role || 'user' },
      lastMessage: null,
      unreadCount: 0
    });
    setShowNewChat(false);
    setUserSearch('');
    setSearchResults([]);
  };

  if (loading) return <div className="p-12 text-center"><div className="animate-pulse h-8 w-8 bg-accent-cyan rounded-full mx-auto"></div></div>;

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-display font-bold text-text-primary">Messages</h1>
      </div>

      <div className="flex-1 glass-panel p-0 overflow-hidden flex flex-col md:flex-row">
        {/* Conversations List */}
        <div className="w-full md:w-80 border-r border-border-glass flex flex-col h-full bg-bg-secondary/50">
          <div className="p-4 border-b border-border-glass flex items-center justify-between">
            <h2 className="font-semibold text-text-primary">Client Chats</h2>
            <button 
              onClick={() => setShowNewChat(!showNewChat)}
              className="text-accent-emerald hover:text-emerald-300 transition-colors p-1"
              title="Start new conversation"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Search */}
          {showNewChat && (
            <div className="p-3 border-b border-border-glass bg-bg-tertiary/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="text"
                  value={userSearch}
                  onChange={(e) => searchUsers(e.target.value)}
                  placeholder="Search your customers..."
                  className="input-base pl-9 w-full text-sm py-2"
                  autoFocus
                />
              </div>
              {searchResults.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-border-glass bg-bg-primary">
                  {searchResults.map(u => (
                    <button
                      key={u._id}
                      onClick={() => startNewChat(u)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-bg-tertiary transition-colors text-left"
                    >
                      <img src={getAvatarUrl(u.avatar, u.name)} className="w-8 h-8 rounded-full object-cover" alt="" />
                      <div>
                        <div className="text-sm font-medium text-text-primary">{u.name}</div>
                        <div className="text-xs text-text-muted">{u.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {searchingUsers && <p className="text-xs text-text-muted mt-2 text-center">Searching...</p>}
              {userSearch.length > 0 && !searchingUsers && searchResults.length === 0 && (
                <p className="text-xs text-text-muted mt-2 text-center">No customers found</p>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 ? conversations.map((conv) => (
              <div 
                key={conv.user._id}
                onClick={() => setActiveChat(conv)}
                className={`p-4 border-b border-border-glass cursor-pointer transition-colors hover:bg-bg-tertiary flex items-center gap-3 ${activeChat?.user._id === conv.user._id ? 'bg-bg-tertiary border-l-2 border-l-accent-emerald' : ''}`}
              >
                <div className="relative">
                  <img src={getAvatarUrl(conv.user.avatar, conv.user.name)} className="w-12 h-12 rounded-full object-cover border border-border-glass" alt="" />
                  {onlineUsers.includes(conv.user._id.toString()) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-bg-secondary"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-medium text-text-primary truncate pr-2">{conv.user.name}</h4>
                  </div>
                  <p className="text-sm text-text-muted truncate">{conv.lastMessage?.message || 'Start chatting...'}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-accent-emerald rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {conv.unreadCount}
                  </div>
                )}
              </div>
            )) : (
              <div className="p-8 text-center text-text-muted">
                <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No conversations yet.</p>
                <p className="text-xs mt-1">Clients will appear here when they message you.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full bg-bg-primary/30">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border-glass bg-bg-secondary/80 backdrop-blur flex items-center gap-3">
                <img src={getAvatarUrl(activeChat.user.avatar, activeChat.user.name)} className="w-10 h-10 rounded-full object-cover" alt="" />
                <div>
                  <h3 className="font-semibold text-text-primary">{activeChat.user.name}</h3>
                  <p className="text-xs text-text-muted capitalize">{activeChat.user.role || 'user'}</p>
                </div>
                {onlineUsers.includes(activeChat.user._id?.toString()) && (
                  <span className="ml-auto text-xs text-success flex items-center gap-1">
                    <div className="w-2 h-2 bg-success rounded-full"></div> Online
                  </span>
                )}
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-text-muted">
                    <MessageCircle className="w-12 h-12 opacity-20 mb-3" />
                    <p>Send a message to start the conversation!</p>
                  </div>
                )}
                {messages.map((msg, idx) => {
                  const isMe = msg.sender === user._id || (msg.sender._id && msg.sender._id === user._id);
                  return (
                    <div key={msg._id || idx} className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end ml-auto' : 'self-start items-start mr-auto'}`}>
                      <div className={`px-4 py-2 rounded-2xl ${isMe ? 'bg-accent-emerald text-white rounded-br-none' : 'bg-bg-tertiary text-text-primary rounded-bl-none border border-border-glass'}`}>
                        {msg.message}
                      </div>
                      <span className="text-[10px] text-text-muted mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-bg-secondary/80 backdrop-blur border-t border-border-glass">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..." 
                    className="input-base flex-1 rounded-full px-5 py-3 focus:border-accent-emerald focus:ring-accent-emerald/20"
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="w-12 h-12 rounded-full bg-accent-emerald hover:bg-emerald-400 text-white flex items-center justify-center shrink-0 disabled:opacity-50 transition-colors shadow-lg"
                  >
                    <Send className="w-5 h-5 ml-1" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted p-8">
              <UserIcon className="w-16 h-16 opacity-20 mb-4" />
              <p className="text-lg mb-2">Select a conversation to start messaging</p>
              <p className="text-sm">Or click the <strong>+</strong> button to message a customer.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechMessages;
