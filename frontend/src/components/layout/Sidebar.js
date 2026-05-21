import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FileText, PlusCircle, Settings, Users, ShieldAlert } from 'lucide-react';

export const Sidebar = () => {
    const { user } = useAuth();

    if (!user) return null;

    const roleMenus = {
        client: [
            { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
            { path: '/tickets', icon: <FileText size={20} />, label: 'Kanban Board' },
            { path: '/tickets/create', icon: <PlusCircle size={20} />, label: 'Create Ticket' },
            { path: '/client-requirements', icon: <PlusCircle size={20} />, label: 'Submit Requirements' },
        ],
        developer: [
            { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
            { path: '/tickets', icon: <FileText size={20} />, label: 'Kanban Board' },
            { path: '/requirements', icon: <ShieldAlert size={20} />, label: 'Assigned Requirements' },
        ],
        admin: [
            { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
            { path: '/tickets', icon: <FileText size={20} />, label: 'Kanban Board' },
            { path: '/requirements', icon: <ShieldAlert size={20} />, label: 'Requirements' },
            { path: '/admin/projects', icon: <Settings size={20} />, label: 'Project Management' },
            { path: '/admin/users', icon: <Users size={20} />, label: 'User Management' },
        ]
    };

    const menuItems = roleMenus[user.role?.toLowerCase()] || [];

    return (
        <div className="sidebar-custom bg-white">
            <div className="p-4 d-flex align-items-center gap-2 mb-3 mt-2 border-bottom">
                {/* <div className="bg-primary text-white rounded d-flex align-items-center justify-content-center p-2 shadow-sm">
                    <ShieldAlert size={24} />
                </div> */}
                <div className="bg-primary text-white rounded d-flex align-items-center justify-content-center p-2 shadow-sm"><i class="fa-solid fa-list-check"></i></div>
                <div>
                    <h5 className="mb-0 fw-bold">Task<span className="text-primary">Phere</span></h5>
                    <small className="text-muted d-block lh-1 mt-1">IT Service Management</small>
                </div>
            </div>

            <div className="d-flex flex-column px-3 overflow-auto flex-grow-1 mb-4 mt-2">
                <small className="text-muted text-uppercase fw-bold mb-3 px-3" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    Main Menu
                </small>
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={({ isActive }) => `nav-link ${isActive ? 'active shadow-sm' : ''} mb-2`}
                    >
                        {item.icon}
                        <span className="fw-medium">{item.label}</span>
                    </NavLink>
                ))}
            </div>

            <div className="mt-auto p-4 border-top">
                <div className="bg-light rounded p-3 text-center">
                    <p className="mb-1 fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Need Help?</p>
                    <p className="text-muted mb-2 lh-sm" style={{ fontSize: '0.75rem' }}>Check our documentation</p>
                    <button className="btn btn-sm btn-outline-primary w-100 fw-medium">View Docs</button>
                </div>
            </div>
        </div>
    );
};
