import React from 'react';

export const StatusBadge = ({ status }) => {
    const normalizedStatus = status?.toLowerCase() || 'open';

    let bgClass = 'bg-secondary';

    switch (normalizedStatus) {
        case 'open':
            bgClass = 'bg-primary';
            break;
        case 'in progress':
            bgClass = 'bg-warning text-dark';
            break;
        case 'resolved':
            bgClass = 'bg-success';
            break;
        case 'closed':
            bgClass = 'bg-dark';
            break;
    }

    return (
        <span className={`badge ${bgClass} px-3 py-2 rounded-pill`} style={{ fontWeight: 500, letterSpacing: '0.03em' }}>
            {status}
        </span>
    );
};
