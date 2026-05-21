import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, PlusSquare, Home, BookOpen, Settings, Users, Link as LinkIcon, X } from 'lucide-react';
import classNames from 'classnames';

function Sidebar({ isOpen, setIsOpen }) {
    const navItems = [
        { path: '/', label: 'Portal Home', icon: Home },
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/tickets', label: 'All Tickets', icon: Ticket },
        { path: '/tickets/new', label: 'Create Ticket', icon: PlusSquare },
        { path: '/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
        { path: '/admin', label: 'Admin Panel', icon: Users },
        { path: '/integrations', label: 'Integrations', icon: LinkIcon },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <>
            <div className={classNames('sidebar', { 'open': isOpen })}>
                <div className="sidebar-header flex justify-between w-full">
                    <div className="flex items-center gap-2">
                        <div className="avatar avatar-sm">IT</div>
                        ServDesk
                    </div>
                    <button className="btn-icon" style={{ display: 'none' }} onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                </div>
                <div className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => classNames('nav-item', { 'active': isActive })}
                            onClick={() => setIsOpen(false)}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Sidebar;
