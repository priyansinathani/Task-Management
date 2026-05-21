import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Paperclip, Send, User, CheckCircle } from 'lucide-react';

export default function TicketDetail() {
    const { id } = useParams();
    const [timeLeft, setTimeLeft] = useState(2 * 3600 + 45 * 60); // 2h 45m in seconds

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (timeInSecs) => {
        const h = Math.floor(timeInSecs / 3600);
        const m = Math.floor((timeInSecs % 3600) / 60);
        const s = timeInSecs % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const isBreaching = timeLeft < 1800; // Less than 30 mins

    // Mock workflows
    const steps = [
        { label: 'Open', status: 'completed' },
        { label: 'In Progress', status: 'active' },
        { label: 'Testing', status: 'pending' },
        { label: 'Resolved', status: 'pending' }
    ];

    return (
        <div className="fade-in max-w-5xl mx-auto" style={{ maxWidth: '64rem', margin: '0 auto' }}>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1">VPN Access Denied <span className="text-muted text-lg font-normal">#{id || 'INC-1025'}</span></h1>
                    <p className="text-sm text-muted">Created on Oct 25, 2023 by Sarah J.</p>
                </div>
                <div className="text-right flex flex-col items-end" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span className="text-sm font-bold text-muted uppercase mb-1 flex items-center gap-1"><Clock size={16} /> SLA Time Remaining</span>
                    <div className={`sla-timer ${isBreaching ? 'sla-breach' : ''}`} style={!isBreaching ? { color: 'var(--success)' } : {}}>{formatTime(timeLeft)}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6" style={{ gridColumn: 'span 2' }}>
                    <div className="card">
                        <h2 className="text-lg font-bold mb-4 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>Description</h2>
                        <p className="text-sm mb-4 leading-relaxed">
                            I am unable to connect to the corporate VPN using Cisco AnyConnect. It keeps saying "Authentication failed" even though I verified my password twice.
                            This is blocking me from accessing the internal staging servers needed for my deploy today at 2 PM. Please help!
                        </p>
                        <div className="flex gap-2">
                            <div className="rounded-md flex items-center p-2 text-sm gap-2 bg-[var(--bg-main)]" style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '0.375rem' }}>
                                <Paperclip size={16} style={{ color: 'var(--primary)' }} />
                                <span>error_screenshot.png</span>
                                <button style={{ color: 'var(--primary)', marginLeft: '0.5rem', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>Download</button>
                            </div>
                        </div>
                    </div>

                    <div className="card flex flex-col" style={{ height: '24rem', display: 'flex', flexDirection: 'column' }}>
                        <h2 className="text-lg font-bold mb-4 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>Comments</h2>
                        <div className="flex-1 overflow-y-auto mb-4" style={{ flex: '1', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
                            <div className="flex gap-3" style={{ display: 'flex', gap: '0.75rem' }}>
                                <div className="avatar"><User size={20} /></div>
                                <div className="flex-1 p-3 rounded-lg bg-[var(--bg-main)]" style={{ border: '1px solid var(--border-color)', flex: '1', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-main)' }}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm">Sarah J. <span className="text-muted font-normal">(Requester)</span></span>
                                        <span className="text-xs text-muted">10:15 AM</span>
                                    </div>
                                    <p className="text-sm">I just restarted my laptop, but the issue persists.</p>
                                </div>
                            </div>
                            <div className="flex gap-3" style={{ display: 'flex', gap: '0.75rem' }}>
                                <div className="avatar" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>JD</div>
                                <div className="flex-1 p-3 rounded-lg" style={{ border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', flex: '1', padding: '0.75rem', borderRadius: '0.5rem', color: '#1e3a8a' }}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm">John D. <span style={{ fontWeight: 400, opacity: 0.8 }}>(Agent)</span></span>
                                        <span className="text-xs" style={{ opacity: 0.8 }}>10:45 AM</span>
                                    </div>
                                    <p className="text-sm">Hi Sarah, looking into this now. There seems to be a sync issue with your Active Directory profile. I'll reset your token.</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-4 mt-auto" style={{ borderTop: '1px solid var(--border-color)', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1rem' }}>
                            <input type="text" className="form-control" placeholder="Write a comment..." />
                            <button className="btn btn-primary"><Send size={18} /></button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card">
                        <h2 className="text-lg font-bold mb-2">Properties</h2>
                        <div className="pt-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="text-sm text-muted">Status</span>
                                <select className="form-control text-sm" style={{ width: 'auto', padding: '0.25rem 2rem 0.25rem 0.5rem' }}>
                                    <option>Open</option>
                                    <option selected>In Progress</option>
                                    <option>Resolved</option>
                                </select>
                            </div>
                            <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-sm text-muted">Priority</span>
                                <span className="badge badge-warning">High</span>
                            </div>
                            <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-sm text-muted">Category</span>
                                <span className="text-sm font-medium">Access Request</span>
                            </div>
                            <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="text-sm text-muted">Assignee</span>
                                <div className="flex items-center gap-2 font-medium" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}><div className="avatar avatar-sm" style={{ width: '1.5rem', height: '1.5rem', fontSize: '0.6rem' }}>JD</div> John D.</div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="text-lg font-bold mb-4">Workflow Status</h2>
                        <div className="workflow-container">
                            <div className="workflow-steps">
                                {steps.map((step, idx) => (
                                    <div key={idx} className={`workflow-step ${step.status}`}>
                                        {step.status === 'completed' ? <CheckCircle size={16} /> : idx + 1}
                                        <span className="workflow-label">{step.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
