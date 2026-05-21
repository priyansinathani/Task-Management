import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Lock, User, ShieldCheck, Mail, Key } from 'lucide-react';

export const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password.length <= 6) {
            setError('Password length must be greater than 6 characters');
            return;
        }

        try {
            if (isLogin) {
                // Login mode
                if (username.trim() && password.trim()) {
                    const res = await api.post('/auth/login', { username, password });
                    login(res.data.user, res.data.user.role, res.data.token, res.data.user._id);
                    navigate('/dashboard');
                } else {
                    setError('Username and password are required');
                }
            } else {
                // Signup mode
                if (username.trim() && email.trim() && password.trim()) {
                    const res = await api.post('/auth/register', { username, email, password, role });
                    login(res.data.user, res.data.user.role, res.data.token, res.data.user._id);
                    navigate('/dashboard');
                } else {
                    setError('All fields are required');
                }
            }
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center w-100 bg-light">
            <div className="card shadow-lg border-0" style={{ width: '400px', borderRadius: '16px', overflow: 'hidden' }}>
                <div className="bg-primary text-white p-4 text-center position-relative overflow-hidden">

                    <div className="text-white fs-3 rounded d-flex align-items-center justify-content-center p-2">
                        <i className="fa-solid fa-list-check"></i>
                    </div>
                    <h3 className="fw-bold mb-1 position-relative z-1">TaskPhere</h3>
                    <p className="mb-0 text-white-50 position-relative z-1">IT Service Management</p>
                </div>

                <div className="p-3 p-md-5 bg-white">
                    <h5 className="fw-bold text-center mb-4 text-muted">
                        {isLogin ? 'Sign In to your account' : 'Create a new account'}
                    </h5>

                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <form onSubmit={handleAuth}>
                        <div className="mb-4">
                            <label className="form-label text-muted fw-bold mb-2">Username</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <User size={18} className="text-secondary" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 ps-0 bg-light"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="mb-4">
                                <label className="form-label text-muted fw-bold mb-2">Email</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                        <Mail size={18} className="text-secondary" />
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control border-start-0 ps-0 bg-light"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="form-label text-muted fw-bold mb-2">Password</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <Key size={18} className="text-secondary" />
                                </span>
                                <input
                                    type="password"
                                    className="form-control border-start-0 ps-0 bg-light"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={7}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-muted fw-bold mb-2">Select Role</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <Lock size={18} className="text-secondary" />
                                </span>
                                <select
                                    className="form-select border-start-0 ps-0 bg-light"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="Client">Client</option>
                                    <option value="Developer">Developer</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm mt-3" style={{ borderRadius: '8px' }}>
                            {isLogin ? 'Sign In to Portal' : 'Sign Up for Portal'}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        {isLogin ? (
                            <p className="text-muted mb-0">
                                Don't have an account?{' '}
                                <span
                                    className="text-primary"
                                    style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                    onClick={() => {
                                        setIsLogin(false);
                                        setError('');
                                    }}
                                >
                                    Sign up
                                </span>
                            </p>
                        ) : (
                            <p className="text-muted mb-0">
                                Already have an account?{' '}
                                <span
                                    className="text-primary"
                                    style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                    onClick={() => {
                                        setIsLogin(true);
                                        setError('');
                                    }}
                                >
                                    Log in
                                </span>
                            </p>
                        )}
                    </div>

                    <div className="text-center mt-3">
                        <small className="text-muted">Secure access via simulated {isLogin ? 'login' : 'sign up'}</small>
                    </div>
                </div>
            </div>
        </div>
    );
};
