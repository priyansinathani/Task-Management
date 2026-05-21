import React from 'react';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const TicketList = () => {
    const { user } = useAuth();

    return (
        <div className="container-fluid py-4 h-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-1">Kanban Board</h3>
                    <p className="text-muted mb-0">Drag and drop tasks to update their status.</p>
                </div>
                {['Admin', 'Client'].includes(user?.role) && (
                    <Link to="/tickets/create" className="btn btn-primary d-flex align-items-center gap-2 px-3 fw-bold shadow-sm rounded-3">
                        <PlusCircle size={18} /> {user.role === 'Client' ? 'Create Ticket' : 'Create Task'}
                    </Link>
                )}
            </div>

            <div className="flex-grow-1 min-h-0">
                <KanbanBoard />
            </div>
        </div>
    );
};
