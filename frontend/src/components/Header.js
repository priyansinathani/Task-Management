import React, { useState } from 'react';
import { Menu, Moon, Sun, Bell, Search, User } from 'lucide-react';
import classNames from 'classnames';

function Header({ theme, toggleTheme, toggleSidebar }) {
    const [showNotif, setShowNotif] = useState(false);

    const notifications = [
        { id: 1, text: 'Ticket INC-1025 assigned to you', time: '10m ago', unread: true },
        { id: 2, text: 'New comment on REQ-802', time: '1h ago', unread: true },
        { id: 3, text: 'Status changed to Resolved for INC-990', time: '2h ago', unread: false },
    ];

    return (
        <header className="header">
            <div className="flex items-center gap-4">
                <button className="btn-icon" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <div className="flex items-center bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)] overflow-hidden" style={{ display: 'flex' }}>
                    <div style={{ padding: '0.375rem 0.5rem', display: 'flex', alignItems: 'center' }}>
                        <Search size={18} className="text-muted" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search tickets, articles..."
                        style={{ border: 'none', background: 'transparent', outline: 'none', padding: '0.375rem 0.5rem', width: '250px', color: 'var(--text-main)' }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="btn-icon" onClick={toggleTheme} title="Toggle Dark/Light Mode">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="relative" style={{ position: 'relative' }}>
                    <button
                        className="btn-icon"
                        onClick={() => setShowNotif(!showNotif)}
                        style={{ position: 'relative' }}
                    >
                        <Bell size={20} />
                        <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, backgroundColor: 'var(--danger)', borderRadius: '50%' }}></span>
                    </button>

                    {showNotif && (
                        <div className="notification-dropdown">
                            <div className="notif-header">
                                <span className="font-bold">Notifications</span>
                                <span className="text-xs cursor-pointer" style={{ color: 'var(--primary)' }}>Mark all as read</span>
                            </div>
                            <div className="notif-list">
                                {notifications.map(n => (
                                    <div key={n.id} className={classNames('notif-item', { 'unread': n.unread })}>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{n.text}</p>
                                            <span className="text-xs text-muted">{n.time}</span>
                                        </div>
                                        {n.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary)', marginTop: 4 }}></div>}
                                    </div>
                                ))}
                            </div>
                            <div className="text-center text-sm cursor-pointer" style={{ padding: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                                View All
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="avatar avatar-sm">
                        <User size={16} />
                    </div>
                    <span className="text-sm font-medium">Admin User</span>
                </div>
            </div>
        </header>
    );
}

export default Header;
