import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, User, LogOut, Moon, Sun, Search } from 'lucide-react';
import { Dropdown, Badge } from 'react-bootstrap';

export const Navbar = () => {
    const { user, theme, toggleTheme, logout } = useAuth();

    // Fake notifications for demo
    const [notifications, setNotifications] = useState([
        { id: 1, text: 'New SLA warning on Ticket #1023', read: false },
        { id: 2, text: 'Ticket #994 was resolved', read: true },
        { id: 3, text: 'Admin assigned a ticket to you', read: false }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    return (
        <div className="navbar-custom">
            <div className="d-flex align-items-center flex-grow-1 me-4">
                {/* Simple search bar in nav */}
                <div className="input-group" style={{ maxWidth: '400px' }}>
                    <span className="input-group-text bg-transparent border-end-0">
                        <Search size={18} className="text-muted" />
                    </span>
                    <input type="text" className="form-control border-start-0 ps-0" placeholder="Search resources..." />
                </div>
            </div>

            <div className="d-flex align-items-center gap-3">
                <button onClick={toggleTheme} className="btn btn-icon border-0" aria-label="Toggle Theme">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <Dropdown align="end">
                    <Dropdown.Toggle as="button" className="btn btn-icon border-0 position-relative">
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-pill">
                                {unreadCount}
                            </Badge>
                        )}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="shadow" style={{ minWidth: '300px' }}>
                        <Dropdown.Header>Notifications</Dropdown.Header>
                        {notifications.length === 0 ? (
                            <Dropdown.Item className="text-muted">No notifications</Dropdown.Item>
                        ) : (
                            notifications.map(n => (
                                <Dropdown.Item
                                    key={n.id}
                                    onClick={() => markAsRead(n.id)}
                                    className={n.read ? 'text-muted' : 'fw-bold'}
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span style={{ fontSize: '0.9rem' }}>{n.text}</span>
                                        {!n.read && <div className="bg-primary rounded-circle ms-2" style={{ width: 8, height: 8 }} />}
                                    </div>
                                </Dropdown.Item>
                            ))
                        )}
                        <Dropdown.Divider />
                        <Dropdown.Item className="text-center text-primary" style={{ fontSize: '0.85rem' }}>View All</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Dropdown align="end">
                    <Dropdown.Toggle as="button" className="btn d-flex align-items-center gap-2 border-0 bg-transparent text-body">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                            <User size={18} />
                        </div>
                        <div className="d-none d-md-block text-start">
                            <div className="fw-semibold lh-1" style={{ fontSize: '0.9rem' }}>{user?.username}</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>{user?.role}</div>
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="shadow">
                        <Dropdown.Item as={Link} to="/profile">Profile Settings</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={logout} className="text-danger d-flex align-items-center gap-2">
                            <LogOut size={16} /> Logout
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
};
