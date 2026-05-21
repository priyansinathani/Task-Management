import React, { useState, useEffect } from 'react';
import { Settings, Users, ShieldAlert, Activity, CheckCircle, Clock } from 'lucide-react';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import api from '../utils/api';

export const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [usersList, setUsersList] = useState([]);
    const [updatingParams, setUpdatingParams] = useState({});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/users');
            setUsersList(res.data);
            
            // Initialize local role state tracker
            const initialRoles = {};
            res.data.forEach(u => initialRoles[u._id] = u.role);
            setUpdatingParams(initialRoles);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRoleChangeSelect = (userId, newRole) => {
        setUpdatingParams({...updatingParams, [userId]: newRole});
    };

    const submitRoleUpdate = async (userId) => {
        const newRole = updatingParams[userId];
        try {
            await api.patch(`/auth/users/${userId}/role`, { role: newRole });
            alert("Role updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update role");
        }
    };

    const deleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to completely delete this user?")) {
            try {
                await api.delete(`/auth/users/${userId}`);
                setUsersList(usersList.filter(u => u._id !== userId));
            } catch (err) {
                console.error(err);
                alert("Failed to delete user");
            }
        }
    };

    const adminCards = [
        { title: 'Total Users', count: usersList.length, icon: <Users size={24} />, color: 'primary' },
        { title: 'Active Roles', count: 3, icon: <ShieldAlert size={24} />, color: 'info' },
        { title: 'System Health', count: '99.9%', icon: <Activity size={24} />, color: 'success' },
        { title: 'Avg SLA Resolve', count: '2.4h', icon: <Clock size={24} />, color: 'warning' },
    ];

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-1">Admin Panel</h3>
                    <p className="text-muted mb-0">System configuration and user management.</p>
                </div>
            </div>

            <div className="row g-4 mb-5">
                {adminCards.map((data, index) => (
                    <div className="col-12 col-sm-6 col-xl-3" key={index}>
                        <SummaryCard {...data} />
                    </div>
                ))}
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white border-bottom p-0">
                    <ul className="nav nav-tabs border-0 px-3 pt-3" style={{ gap: '10px' }}>
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 fw-bold pb-3 ${activeTab === 'users' ? 'active text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                                onClick={() => setActiveTab('users')}
                            >
                                <Users size={18} className="me-2" /> User Management
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 fw-bold pb-3 ${activeTab === 'sla' ? 'active text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                                onClick={() => setActiveTab('sla')}
                            >
                                <ShieldAlert size={18} className="me-2" /> SLA Configuration
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 fw-bold pb-3 ${activeTab === 'workflow' ? 'active text-primary border-bottom border-primary border-3' : 'text-muted'}`}
                                onClick={() => setActiveTab('workflow')}
                            >
                                <Settings size={18} className="me-2" /> Workflow Settings
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="card-body p-4 p-md-5 bg-light">
                    {activeTab === 'users' && (
                        <div className="bg-white p-4 rounded-4 shadow-sm border">
                            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><Users className="text-primary" /> Manage Users & Roles</h5>
                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usersList.map((u) => (
                                            <tr key={u._id}>
                                                <td className="fw-bold">{u.username}</td>
                                                <td>{u.email}</td>
                                                <td>
                                                    <select 
                                                        className="form-select form-select-sm" 
                                                        value={updatingParams[u._id] || u.role}
                                                        onChange={(e) => handleRoleChangeSelect(u._id, e.target.value)}
                                                    >
                                                        <option value="Client">Client</option>
                                                        <option value="Developer">Developer</option>
                                                        <option value="Admin">Admin</option>
                                                        <option value="user">User (Legacy)</option>
                                                    </select>
                                                </td>
                                                <td><span className="badge bg-success-subtle text-success border border-success px-2 py-1">Active</span></td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button 
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => submitRoleUpdate(u._id)}
                                                        >
                                                            Update
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => deleteUser(u._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'sla' && (
                        <div className="bg-white p-4 rounded-4 shadow-sm border col-md-8 mx-auto">
                            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><ShieldAlert className="text-warning" /> SLA Policies</h5>

                            <form>
                                <div className="mb-4">
                                    <label className="form-label fw-bold">Critical Priority SLA (Hours)</label>
                                    <input type="number" className="form-control" defaultValue={2} />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold">High Priority SLA (Hours)</label>
                                    <input type="number" className="form-control" defaultValue={4} />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold">Medium Priority SLA (Hours)</label>
                                    <input type="number" className="form-control" defaultValue={24} />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold">Low Priority SLA (Hours)</label>
                                    <input type="number" className="form-control" defaultValue={48} />
                                </div>
                                <button type="button" className="btn btn-primary fw-bold px-4"><CheckCircle size={18} className="me-2" /> Save Configuration</button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'workflow' && (
                        <div className="bg-white p-4 rounded-4 shadow-sm border text-center py-5">
                            <Settings size={48} className="text-muted mb-3 opacity-50" />
                            <h5 className="fw-bold text-dark">Workflow Automation Builder</h5>
                            <p className="text-muted col-md-6 mx-auto">Configure custom states, triggers, and automated actions for ticket progression. This feature is currently in beta.</p>
                            <button className="btn btn-primary fw-bold mt-3">Try Beta Builder</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
