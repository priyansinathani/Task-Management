import React from 'react';
import { Camera } from 'lucide-react';

export default function ProfileSettings() {
    return (
        <div className="fade-in max-w-3xl mx-auto" style={{ maxWidth: '48rem', margin: '0 auto' }}>
            <h1 className="text-2xl font-bold mb-6">Profile & Settings</h1>

            <div className="grid gap-6 md:grid-cols-3" style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: '1.5rem' }}>
                <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 'fit-content' }}>
                    <div className="relative mb-4" style={{ position: 'relative' }}>
                        <div className="avatar mx-auto" style={{ width: 96, height: 96, fontSize: '2.5rem' }}>
                            AD
                        </div>
                        <button className="btn-icon" style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '50%', padding: '0.25rem' }}>
                            <Camera size={16} style={{ color: 'var(--primary)' }} />
                        </button>
                    </div>
                    <h2 className="font-bold">Admin User</h2>
                    <p className="text-sm text-muted mb-4">admin@company.com</p>
                    <span className="badge badge-primary">Administrator</span>
                </div>

                <div className="card space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <h3 className="text-lg font-bold mb-4 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>Personal Information</h3>
                        <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group mb-0">
                                <label className="form-label">First Name</label>
                                <input type="text" className="form-control" defaultValue="Admin" />
                            </div>
                            <div className="form-group mb-0">
                                <label className="form-label">Last Name</label>
                                <input type="text" className="form-control" defaultValue="User" />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-control" defaultValue="admin@company.com" disabled style={{ opacity: 0.7 }} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>Change Password</h3>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label">Current Password</label>
                            <input type="password" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input type="password" className="form-control" />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>Email Notifications</h3>
                        <div className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <label className="cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked /> <span className="text-sm">When a ticket is assigned to me</span>
                            </label>
                            <label className="cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked /> <span className="text-sm">When a ticket status changes</span>
                            </label>
                            <label className="cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked /> <span className="text-sm">New comments on my tickets</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4" style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)' }}>
                        <button className="btn btn-primary">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
