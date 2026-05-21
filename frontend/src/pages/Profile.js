import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, CheckCircle, ListTodo, Award, Edit3, Key, Save, X } from 'lucide-react';
import api from '../utils/api';

export const Profile = () => {
    const { user, logout, updateUser } = useAuth();
    const [stats, setStats] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        currentPassword: '',
        newPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, username: user.username, email: user.email || '' }));
        }
        if (user && user.role === 'Developer') {
            api.get('/tickets/dashboard/summary')
               .then(res => setStats(res.data.stats))
               .catch(console.error);
        }
    }, [user]);

    if (!user) return null;

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // Simple validation
        if (formData.newPassword && !formData.currentPassword) {
            setError("Current password is required to set a new password.");
            return;
        }

        try {
            const dataToUpdate = { username: formData.username, email: formData.email };
            if (formData.currentPassword && formData.newPassword) {
                dataToUpdate.currentPassword = formData.currentPassword;
                dataToUpdate.newPassword = formData.newPassword;
            }
            const res = await api.patch('/auth/profile', dataToUpdate);
            updateUser({ username: formData.username, email: formData.email });
            setMessage(res.data.message);
            setIsEditing(false);
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        }
    };

    return (
        <div className="container-fluid py-4 h-100 flex-grow-1 overflow-auto">
            <h3 className="fw-bold mb-4">My Profile Settings</h3>

            {message && <div className="alert alert-success shadow-sm mb-4"><CheckCircle size={18} className="me-2"/>{message}</div>}
            {error && <div className="alert alert-danger shadow-sm mb-4">{error}</div>}

            <div className="row g-4">
                <div className="col-lg-5">
                    <div className="card shadow-sm border-0 rounded-4 text-center">
                        <div className="card-body p-4 p-md-5 d-flex flex-column align-items-center">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-3 shadow-sm position-relative" style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>
                                <span className="fw-bold">{user.username.charAt(0).toUpperCase()}</span>
                                <button onClick={() => { setIsEditing(!isEditing); setMessage(''); setError(''); }} className="btn btn-sm btn-light position-absolute bottom-0 end-0 rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center border" style={{ width: 35, height: 35 }}>
                                    {isEditing ? <X size={16} className="text-danger" /> : <Edit3 size={16} className="text-primary" />}
                                </button>
                            </div>
                            
                            {!isEditing ? (
                                <>
                                    <h4 className="fw-bold text-dark mb-1">{user.username}</h4>
                                    <p className="text-muted mb-3 d-flex align-items-center justify-content-center gap-2">
                                        <Shield size={16} className="text-primary"/> {user.role}
                                    </p>
                                    
                                    <hr className="w-100 text-muted" />
                                    
                                    <ul className="list-group list-group-flush w-100 text-start px-3">
                                        <li className="list-group-item px-0 py-3 bg-transparent d-flex align-items-center justify-content-between border-0">
                                            <span className="text-muted d-flex align-items-center gap-2"><Mail size={18} /> Email</span>
                                            <span className="fw-bold text-dark">{user.email || 'Not Provided'}</span>
                                        </li>
                                        <li className="list-group-item px-0 py-3 bg-transparent d-flex align-items-center justify-content-between border-0">
                                            <span className="text-muted d-flex align-items-center gap-2"><User size={18} /> Member Status</span>
                                            <span className="badge bg-success-subtle text-success border border-success px-2 py-1">Active</span>
                                        </li>
                                    </ul>
                                </>
                            ) : (
                                <form onSubmit={handleSaveProfile} className="w-100 text-start mt-3">
                                    <h6 className="fw-bold text-muted text-uppercase mb-3" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>Personal Information</h6>
                                    
                                    <div className="mb-3">
                                        <label className="form-label text-muted fw-bold mb-1 small">Username</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0"><User size={16} className="text-muted"/></span>
                                            <input type="text" className="form-control bg-light border-start-0 ps-0" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="form-label text-muted fw-bold mb-1 small">Email Address</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0"><Mail size={16} className="text-muted"/></span>
                                            <input type="email" className="form-control bg-light border-start-0 ps-0" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                                        </div>
                                    </div>

                                    <h6 className="fw-bold text-muted text-uppercase mb-3 pt-3 border-top" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>Security Settings</h6>
                                    
                                    <div className="mb-3">
                                        <label className="form-label text-muted fw-bold mb-1 small">Current Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0"><Key size={16} className="text-muted"/></span>
                                            <input type="password" placeholder="Leave blank to skip" className="form-control bg-light border-start-0 ps-0" value={formData.currentPassword} onChange={(e) => setFormData({...formData, currentPassword: e.target.value})} />
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="form-label text-muted fw-bold mb-1 small">New Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0"><Key size={16} className="text-muted"/></span>
                                            <input type="password" placeholder="New Password" className="form-control bg-light border-start-0 ps-0" value={formData.newPassword} onChange={(e) => setFormData({...formData, newPassword: e.target.value})} minLength={7} />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-success fw-bold w-100 shadow-sm d-flex align-items-center justify-content-center gap-2">
                                        <Save size={18} /> Save Changes
                                    </button>
                                </form>
                            )}
                            
                            {!isEditing && (
                                <button onClick={logout} className="btn btn-outline-danger w-100 mt-4 fw-bold shadow-sm">
                                    Logout Safely
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-7">
                    <div className="card shadow-sm border-0 rounded-4 h-100">
                        <div className="card-header bg-white p-4 border-bottom">
                            <h5 className="fw-bold mb-0">Activity Overview</h5>
                        </div>
                        <div className="card-body p-4 p-md-5">
                            {user.role === 'Developer' ? (
                                <>
                                    <h6 className="text-muted fw-bold text-uppercase mb-4">Your Task Statistics</h6>
                                    <div className="row g-4">
                                        <div className="col-sm-6 text-center text-sm-start">
                                            <div className="d-flex align-items-center gap-3 border p-4 rounded-4 bg-light shadow-sm flex-wrap">
                                                <div className="bg-primary text-white p-3 rounded-circle d-flex align-items-center justify-content-center">
                                                    <ListTodo size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="fw-bold mb-0 text-dark">{stats?.open || 0}</h3>
                                                    <p className="text-muted mb-0 small fw-medium">Active Tasks</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 text-center text-sm-start">
                                            <div className="d-flex align-items-center gap-3 border p-4 rounded-4 bg-success-subtle shadow-sm flex-wrap">
                                                <div className="bg-success text-white p-3 rounded-circle d-flex align-items-center justify-content-center">
                                                    <CheckCircle size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="fw-bold mb-0 text-success">{stats?.resolved || 0}</h3>
                                                    <p className="text-success opacity-75 mb-0 small fw-medium">Completed Tasks</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 text-center p-5 bg-light rounded-4 border border-dashed text-muted">
                                        <Award size={40} className="text-warning mb-3 opacity-50" />
                                        <h5 className="fw-bold text-dark opacity-75">Great work!</h5>
                                        <p className="small mb-0">Keep tracking down issues and resolving tickets.</p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-5 h-100 d-flex flex-column justify-content-center">
                                    <Shield size={64} className="text-muted mb-4 opacity-50 mx-auto" />
                                    <h4 className="fw-bold text-dark opacity-75">Welcome, {user.role}!</h4>
                                    <p className="text-muted col-md-8 mx-auto">Your role determines your access to projects and requirements across the entire Taskphere system. This dashboard tracks your core operational impact.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
