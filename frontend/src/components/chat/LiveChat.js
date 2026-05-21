import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, X, Send } from 'lucide-react';
import api from '../../utils/api';

// Connect to the backend socket
const socket = io('http://localhost:3002');

export const LiveChat = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Initial bot message depending on role
    useEffect(() => {
        if (!user) return;

        const loadMessages = async () => {
            try {
                const res = await api.get('/chat');
                const formattedHistory = res.data.map(m => ({
                    author: m.sender,
                    role: m.sender === 'System' ? 'system' : 'user', // basic mapping
                    text: m.text,
                    timestamp: m.createdAt
                }));
                
                setMessages([
                    ...formattedHistory,
                    {
                        author: 'System',
                        role: 'system',
                        text: user.role === 'developer' || user.role === 'admin' 
                            ? 'Welcome to the support channel. You can help users here.'
                            : 'Hello! How can our support team help you today?',
                        timestamp: new Date()
                    }
                ]);
            } catch (err) {
                console.error("Failed to load chat history:", err);
            }
        };

        loadMessages();
        
        // Listen for new messages
        socket.on('receive_message', (data) => {
            setMessages((prevMsg) => [...prevMsg, data]);
        });
        
        return () => {
            socket.off('receive_message');
        };
    }, [user]);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (currentMessage.trim() !== '') {
            const messageData = {
                author: user.username || 'Guest',
                role: user.role || 'user',
                text: currentMessage,
                timestamp: new Date()
            };
            await socket.emit('send_message', messageData);
            setCurrentMessage('');
        }
    };

    if (!user) return null; // Only show chat if logged in

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center p-3"
                    style={{ width: '60px', height: '60px' }}
                >
                    <MessageSquare size={28} />
                </button>
            )}

            {isOpen && (
                <div className="card shadow-lg border-0" style={{ width: '350px', height: '500px', display: 'flex', flexDirection: 'column' }}>
                    <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                            <MessageSquare size={18} />
                            {user.role === 'developer' || user.role === 'admin' ? 'Support Portal' : 'Live Chat'}
                        </h6>
                        <button className="btn btn-sm btn-link text-white p-0" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="card-body bg-light p-3" style={{ flex: 1, overflowY: 'auto' }}>
                        {messages.map((msg, idx) => {
                            const isMe = msg.author === user.username;
                            const isSystem = msg.role === 'system';
                            
                            if (isSystem) {
                                return (
                                    <div key={idx} className="text-center my-2">
                                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>{msg.text}</small>
                                    </div>
                                );
                            }

                            return (
                                <div key={idx} className={`mb-3 d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'}`}>
                                    <small className="text-muted mb-1" style={{ fontSize: '0.7rem' }}>
                                        {msg.author} {msg.role !== 'user' && `(${msg.role})`}
                                    </small>
                                    <div 
                                        className={`px-3 py-2 rounded-3 shadow-sm ${isMe ? 'bg-primary text-white' : 'bg-white border'}`}
                                        style={{ maxWidth: '85%' }}
                                    >
                                        <span style={{ fontSize: '0.9rem' }}>{msg.text}</span>
                                    </div>
                                    <small className="text-muted mt-1" style={{ fontSize: '0.65rem' }}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </small>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="card-footer bg-white p-3 border-top">
                        <form onSubmit={sendMessage} className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control bg-light border-0 px-3"
                                placeholder="Type a message..."
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary d-flex align-items-center justify-content-center p-2 rounded-circle" disabled={!currentMessage.trim()}>
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
