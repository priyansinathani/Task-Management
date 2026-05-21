import React from 'react';
import { Settings, Power, Webhook, Key } from 'lucide-react';

export default function Integrations() {
    const integrations = [
        { name: 'Jira Software', desc: 'Sync tickets bi-directionally with Jira issues.', status: 'Connected', icon: Webhook },
        { name: 'Slack', desc: 'Get notifications and create tickets directly from Slack.', status: 'Disconnected', icon: Webhook },
        { name: 'Email System', desc: 'Convert incoming emails at IT@company.com to tickets.', status: 'Connected', icon: Webhook },
    ];

    return (
        <div className="fade-in max-w-4xl mx-auto" style={{ maxWidth: '64rem', margin: '0 auto' }}>
            <h1 className="text-2xl font-bold mb-6">Integrations & API</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {integrations.map((int, i) => (
                    <div key={i} className="card flex flex-col justify-between" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <div className="flex justify-between items-start mb-4" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ backgroundColor: 'var(--primary-light)', padding: '0.5rem', borderRadius: '0.5rem', color: 'var(--primary)' }}>
                                    <int.icon size={24} />
                                </div>
                                <span className={`badge badge-${int.status === 'Connected' ? 'success' : 'secondary'}`}>{int.status}</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">{int.name}</h3>
                            <p className="text-sm text-muted mb-4">{int.desc}</p>
                        </div>
                        <button className={`btn w-full ${int.status === 'Connected' ? 'btn-outline border-danger text-danger' : 'btn-primary'}`} style={{ width: '100%', ...(int.status === 'Connected' ? { borderColor: 'var(--danger)', color: 'var(--danger)' } : {}) }}>
                            {int.status === 'Connected' ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>
                ))}
            </div>

            <div className="card">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Settings size={20} className="text-primary" style={{ color: 'var(--primary)' }} /> API Keys Configuration</h2>
                <p className="text-sm text-muted mb-6">Manage external application access to the portal API.</p>

                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Key Name</th>
                                <th>Key (Partial)</th>
                                <th>Created</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="font-medium">Jira Sync Agent</td>
                                <td className="text-xs" style={{ fontFamily: 'monospace' }}>pk_test_****************a89c</td>
                                <td className="text-sm text-muted">Oct 12, 2023</td>
                                <td><span className="badge badge-success">Active</span></td>
                                <td><button className="btn-icon text-muted hover-danger" style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text-muted)' }} onMouseOver={(e) => e.target.style.color = 'var(--danger)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}><Power size={16} /></button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 pt-4 border-t" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-start' }}>
                    <button className="btn btn-primary flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}><Key size={16} /> Generate New API Key</button>
                </div>
            </div>
        </div>
    );
}
