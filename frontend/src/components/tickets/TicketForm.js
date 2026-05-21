import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export const TicketForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        project: '',
        assignee: ''
    });
    const [projects, setProjects] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // Fetch projects so task can be linked to one
        api.get('/projects').then(res => {
            setProjects(res.data);
            if(res.data.length > 0) {
                setFormData(prev => ({ ...prev, project: res.data[0]._id }));
            }
        }).catch(err => console.error(err));
    }, []);

    const selectedProjectObj = projects.find(p => p._id === formData.project);
    const availableDevelopers = selectedProjectObj?.developers || [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.post('/tickets', {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                project: formData.project || null,
                assignee: formData.assignee || null,
                status: 'To Do'
            });
            
            setIsSubmitting(false);
            setIsSuccess(true);
            setFormData({ title: '', description: '', priority: 'Medium', project: projects[0]?._id, assignee: '' });

            setTimeout(() => {
                setIsSuccess(false);
                navigate('/tickets');
            }, 1000);
        } catch (err) {
            console.error(err);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card shadow-sm border-0 mb-4 rounded-4 bg-light mt-4">
            {isSuccess && (
                <div className="position-absolute w-100 h-100 bg-white d-flex flex-column align-items-center justify-content-center z-3" style={{ opacity: 0.95, borderRadius: '16px' }}>
                    <CheckCircle size={64} className="text-success mb-3" />
                    <h4 className="fw-bold text-success">{user?.role === 'Client' ? 'Ticket' : 'Task'} Created Successfully!</h4>
                    <p className="text-muted">Redirecting you to Kanban board...</p>
                </div>
            )}

            <div className="card-header bg-white border-bottom p-4">
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                    <FileText className="text-primary" size={24} /> {user?.role === 'Client' ? 'Create New Ticket' : 'Create New Task'}
                </h5>
                <small className="text-muted">Fill out the details below to add a new {user?.role === 'Client' ? 'ticket' : 'task'} to a project</small>
            </div>

            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-12">
                            <label className="form-label fw-medium text-muted">{user?.role === 'Client' ? 'Ticket Title' : 'Task Title'} <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control border-0 shadow-sm"
                                required
                                placeholder="E.g., Implement login API"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-medium text-muted">Project</label>
                            <select
                                className="form-select border-0 shadow-sm"
                                value={formData.project}
                                onChange={(e) => setFormData({ ...formData, project: e.target.value, assignee: '' })}
                            >
                                <option value="">General (No specific project)</option>
                                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                        </div>
                        
                        {user?.role !== 'Client' && (
                            <div className="col-md-4">
                                <label className="form-label fw-medium text-muted">Assignee</label>
                                <select
                                    className="form-select border-0 shadow-sm"
                                    value={formData.assignee}
                                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                                >
                                    <option value="">Unassigned</option>
                                    {availableDevelopers.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
                                </select>
                            </div>
                        )}
                        
                        <div className="col-md-4">
                            <label className="form-label fw-medium text-muted">Priority <span className="text-danger">*</span></label>
                            <select
                                className="form-select border-0 shadow-sm"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Critical</option>
                            </select>
                        </div>

                        <div className="col-12 mb-4">
                            <label className="form-label fw-medium text-muted">Description <span className="text-danger">*</span></label>
                            <textarea
                                className="form-control border-0 shadow-sm"
                                rows="5"
                                required
                                placeholder="Provide a detailed description of the task..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="d-flex justify-content-end gap-3 mt-4 w-100">
                            <button type="button" className="btn btn-light px-4 fw-bold shadow-sm" onClick={() => navigate(-1)}>Cancel</button>
                            <button type="submit" className="btn btn-primary px-4 fw-bold shadow-sm d-flex align-items-center gap-2" disabled={isSubmitting}>
                                {isSubmitting ? <span className="spinner-border spinner-border-sm" /> : <FileText size={18} />}
                                {user?.role === 'Client' ? 'Submit Ticket' : 'Submit Task'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
