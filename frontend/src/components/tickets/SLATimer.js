import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export const SLATimer = ({ deadline }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [statusName, setStatusName] = useState('safe'); // safe, warning, breach

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(deadline) - +new Date();

            if (difference <= 0) {
                setTimeLeft('00:00:00');
                setStatusName('breach');
                return;
            }

            const hours = Math.floor((difference / (1000 * 60 * 60)));
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );

            // if less than 1 hour -> warning
            if (hours < 1) {
                setStatusName('warning');
            } else {
                setStatusName('safe');
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [deadline]);

    let iconColor = 'var(--success)';
    let bgClass = 'bg-success-subtle text-success';
    let Icon = Clock;

    if (statusName === 'warning') {
        iconColor = 'var(--warning)';
        bgClass = 'bg-warning-subtle text-warning';
    } else if (statusName === 'breach') {
        iconColor = 'var(--danger)';
        bgClass = 'bg-danger-subtle text-danger';
        Icon = AlertTriangle;
    }

    return (
        <div className={`d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill firmware-bold ${bgClass}`} style={{ border: `1px solid ${iconColor}40` }}>
            <Icon size={16} />
            <span className="fw-bold fs-6" style={{ fontFamily: 'monospace' }}>{timeLeft}</span>
        </div>
    );
};
