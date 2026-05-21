import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const SummaryCard = ({ title, count, icon, color, subtitle }) => {
    return (
        <div className="card shadow-sm h-100 border-0" style={{ borderLeft: `4px solid var(--${color})` }}>
            <div className="card-body p-4 d-flex justify-content-between align-items-center">
                <div>
                    <h6 className="text-muted fw-bold text-uppercase mb-2" style={{ letterSpacing: '0.05em' }}>{title}</h6>
                    <h2 className="mb-0 fw-bold">{count}</h2>
                    {subtitle && <small className="text-muted d-block mt-1">{subtitle}</small>}
                </div>
                <div
                    className="d-flex align-items-center justify-content-center rounded mt-n2 mb-n2"
                    style={{ width: '60px', height: '60px', backgroundColor: `var(--${color})`, opacity: 0.1, position: 'relative' }}
                >
                </div>
                <div style={{ position: 'absolute', right: '35px', color: `var(--${color})` }}>
                    {icon}
                </div>
            </div>
        </div>
    );
};
