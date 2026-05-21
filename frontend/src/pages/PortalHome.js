import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Users, Key, Settings, Search } from 'lucide-react';

export default function PortalHome() {
    const navigate = useNavigate();

    const categories = [
        { title: 'IT Support', icon: Monitor, desc: 'Hardware and software issues, setups' },
        { title: 'HR Requests', icon: Users, desc: 'Onboarding, leave, benefits, payroll' },
        { title: 'Access Request', icon: Key, desc: 'VPN, software licenses, database access' },
        { title: 'Technical Issue', icon: Settings, desc: 'Network, bug reports, system failures' }
    ];

    return (
        <div className="max-w-4xl mx-auto" style={{ maxWidth: '64rem', margin: '0 auto' }}>
            <div className="text-center mb-8 fade-in">
                <h1 className="text-3xl font-bold mb-4">How can we help you today?</h1>
                <div className="flex justify-center">
                    <div className="flex items-center bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)] overflow-hidden w-full max-w-lg shadow-sm" style={{ maxWidth: '32rem', margin: '0 auto', display: 'flex' }}>
                        <div className="p-3" style={{ padding: '0.75rem' }}>
                            <Search size={20} className="text-muted" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for solutions, services, and tickets..."
                            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', padding: '0.75rem', color: 'var(--text-main)' }}
                        />
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4 fade-in">Browse Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in" style={{ animationDelay: '0.1s' }}>
                {categories.map((cat, i) => (
                    <div
                        key={i}
                        className="card text-center cursor-pointer"
                        onClick={() => navigate('/tickets/new')}
                        style={{ transition: 'transform 0.2s', cursor: 'pointer' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div className="flex justify-center mb-4" style={{ color: 'var(--primary)', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                            <cat.icon size={48} />
                        </div>
                        <h3 className="font-bold mb-2">{cat.title}</h3>
                        <p className="text-sm text-muted">{cat.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
