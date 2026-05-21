import React, { useState } from 'react';
import { UploadCloud, CheckCircle } from 'lucide-react';

export default function CreateTicket() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="card max-w-2xl mx-auto text-center py-12 fade-in" style={{ padding: '3rem 1.5rem', marginTop: '2rem' }}>
                <div className="flex justify-center mb-4 text-success" style={{ color: 'var(--success)', display: 'flex', justifyContent: 'center' }}><CheckCircle size={64} /></div>
                <h2 className="text-2xl font-bold mb-2">Ticket Created Successfully!</h2>
                <p className="text-muted mb-6">Your ticket ID is <strong>INC-1026</strong>. We've sent a confirmation to your email.</p>
                <button className="btn btn-primary" onClick={() => setSubmitted(false)}>Create Another Ticket</button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto fade-in" style={{ maxWidth: '48rem', margin: '0 auto' }}>
            <h1 className="text-2xl font-bold mb-6">Create New Ticket</h1>
            <form onSubmit={handleSubmit} className="card">
                <div className="form-group">
                    <label className="form-label">Issue Title</label>
                    <input type="text" className="form-control" placeholder="Brief summary of the issue" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="form-group mb-0">
                        <label className="form-label">Category</label>
                        <select className="form-control" required style={{ paddingRight: '2.5rem' }}>
                            <option value="">Select Category</option>
                            <option value="IT">IT Support</option>
                            <option value="HR">HR Request</option>
                            <option value="Access">Access Request</option>
                            <option value="Bug">Technical Issue</option>
                        </select>
                    </div>
                    <div className="form-group mb-0">
                        <label className="form-label">Priority</label>
                        <select className="form-control" required style={{ paddingRight: '2.5rem' }}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>

                <div className="form-group" style={{ marginTop: '1.25rem' }}>
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows="5" placeholder="Provide detailed information..." required></textarea>
                </div>

                <div className="form-group">
                    <label className="form-label">Attachments</label>
                    <div className="border-2 border-dashed border-[var(--border-color)] rounded-lg p-8 text-center bg-[var(--bg-main)]" style={{ border: '2px dashed var(--border-color)', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-main)' }}>
                        <div className="flex justify-center text-muted mb-2" style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-muted)' }}><UploadCloud size={32} /></div>
                        <p className="text-sm">Drag and drop files here or <span className="font-bold cursor-pointer" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>browse</span></p>
                        <p className="text-xs mt-1 text-muted">Max file size: 10MB</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <button type="button" className="btn btn-outline">Cancel</button>
                    <button type="submit" className="btn btn-primary">Submit Ticket</button>
                </div>
            </form>
        </div>
    );
}
