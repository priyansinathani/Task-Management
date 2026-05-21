import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { KanbanCard } from './KanbanCard';

export const KanbanColumn = ({ id, title, tasks }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    const style = {
        background: isOver ? '#e2e8f0' : '#f8f9fa',
        minWidth: '320px',
        maxWidth: '320px',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'background-color 0.2s ease'
    };

    return (
        <div ref={setNodeRef} style={style} className="shadow-sm border">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0 text-dark">{title}</h6>
                <span className="badge bg-secondary rounded-pill">{tasks.length}</span>
            </div>
            
            <div className="d-flex flex-column gap-3 flex-grow-1" style={{ minHeight: '150px' }}>
                {tasks.map(task => (
                    <KanbanCard key={task._id} task={task} />
                ))}
            </div>
        </div>
    );
};
