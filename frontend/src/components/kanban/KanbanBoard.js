import React, { useState, useEffect } from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { KanbanColumn } from './KanbanColumn';
import { Search, Filter } from 'lucide-react';
import api from '../../utils/api';

export const KanbanBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('All');
    
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tickets');
            setTasks(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor)
    );

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over) return;

        const taskId = active.id;
        const newStatus = over.id;

        const task = tasks.find(t => t._id === taskId);
        if (task && task.status !== newStatus) {
            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
            
            try {
                await api.put(`/tickets/${taskId}/status`, { status: newStatus });
            } catch (err) {
                console.error("Failed to update status", err);
                setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: task.status } : t));
            }
        }
    };

    if (loading) return <div className="p-5 text-center"><span className="spinner-border text-primary" /></div>;

    const filteredTasks = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
        return matchesSearch && matchesPriority;
    });

    const columns = ['To Do', 'In Progress', 'Done'];

    return (
        <div className="d-flex flex-column h-100 pb-4">
            <div className="d-flex flex-wrap gap-3 mb-4">
                <div className="input-group shadow-sm" style={{ maxWidth: '300px' }}>
                    <span className="input-group-text bg-white border-end-0"><Search size={18} className="text-muted"/></span>
                    <input 
                        type="text" 
                        className="form-control border-start-0 ps-0" 
                        placeholder="Search tasks..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="input-group shadow-sm" style={{ maxWidth: '200px' }}>
                    <span className="input-group-text bg-white border-end-0"><Filter size={18} className="text-muted"/></span>
                    <select 
                        className="form-select border-start-0 ps-0"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="All">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>
            </div>

            <div className="d-flex gap-4 flex-grow-1" style={{ overflowX: 'auto', minHeight: '70vh' }}>
                <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                    {columns.map(status => (
                        <KanbanColumn 
                            key={status} 
                            id={status} 
                            title={status} 
                            tasks={filteredTasks.filter(t => (t.status === status) || (status === 'To Do' && t.status === 'Open') || (status === 'Done' && (t.status === 'Resolved' || t.status === 'Closed')))} 
                        />
                    ))}
                </DndContext>
            </div>
        </div>
    );
};
