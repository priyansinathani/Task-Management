import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const KanbanCard = ({ task }) => {
    const { user } = useAuth();
    const isClient = user?.role === 'Client';
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task._id,
        disabled: isClient
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        cursor: isClient ? 'default' : (isDragging ? 'grabbing' : 'grab'),
        opacity: isDragging ? 0.8 : 1,
        borderRadius: '8px',
        userSelect: 'none',
        zIndex: isDragging ? 999 : 1,
        position: 'relative'
    };

    const getPriorityColor = () => {
        switch (task.priority) {
            case 'Critical':
            case 'High': return 'danger';
            case 'Medium': return 'warning';
            default: return 'info';
        }
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...listeners} 
            {...attributes}
            className="card border-0 shadow-sm kanban-card"
        >
            <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className={`badge bg-${getPriorityColor()} bg-opacity-10 text-${getPriorityColor()} border border-${getPriorityColor()}`}>
                        {task.priority || 'Medium'}
                    </span>
                    <Link to={`/tickets/${task._id}`} className="text-muted" onPointerDown={(e) => e.stopPropagation()}>
                        <i className="fa-solid fa-up-right-from-square" style={{ fontSize: '12px' }}></i>
                    </Link>
                </div>
                <h6 className="fw-bold mb-2 text-dark">{task.title}</h6>
                <p className="text-muted small mb-3 kanban-desc" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{task.description}</p>
                
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center text-muted small gap-1">
                        <Calendar size={14} />
                        <span>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No date'}</span>
                    </div>
                    {task.assignee ? (
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '28px', height: '28px', fontSize: '12px' }} title={task.assignee.username}>
                            {task.assignee.username.charAt(0).toUpperCase()}
                        </div>
                    ) : (
                        <div title="Unassigned" className="bg-light rounded-circle d-flex align-items-center justify-content-center text-muted border" style={{ width: '28px', height: '28px' }}>
                            <User size={14} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
