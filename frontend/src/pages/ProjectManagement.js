import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { PlusCircle, Users, Folder, Calendar } from 'lucide-react';

export const ProjectManagement = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]); // Fetch all users to assign as developers
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState(null);
    
    const [formData, setFormData] = useState({ name: '', description: '', developers: [], client: '', endDate: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const projRes = await api.get('/projects');
            setProjects(projRes.data);

            const usersRes = await api.get('/auth/users').catch(() => ({ data: [] }));
            setUsers(usersRes.data);
            
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProjectId) {
                const res = await api.patch(`/projects/${editingProjectId}`, formData);
                setProjects(projects.map(p => p._id === editingProjectId ? res.data : p));
                setEditingProjectId(null);
            } else {
                const res = await api.post('/projects', formData);
                setProjects([...projects, res.data]);
            }
            setShowForm(false);
            setFormData({ name: '', description: '', developers: [], client: '', endDate: '' });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || err.response?.data?.error || err.message || "An error occurred");
        }
    };

    const handleDeleteProject = async (id) => {
        if(window.confirm("Are you sure you want to delete this project? All associated tasks might be orphaned or deleted.")) {
            try {
                await api.delete(`/projects/${id}`);
                setProjects(projects.filter(p => p._id !== id));
            } catch (err) {
                console.error(err);
                alert("Failed to delete project");
            }
        }
    };

    const handleEditClick = (proj) => {
        setFormData({
            name: proj.name,
            description: proj.description || '',
            developers: proj.developers ? proj.developers.map(d => d._id) : [],
            client: proj.client?._id || '',
            endDate: proj.endDate ? new Date(proj.endDate).toISOString().split('T')[0] : ''
        });
        setEditingProjectId(proj._id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeveloperChange = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        setFormData({ ...formData, developers: selected });
    };

    return (
        <div className="container-fluid py-4 h-100 flex-grow-1 overflow-auto">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-1">Project Management</h3>
                    <p className="text-muted mb-0">Create new projects and oversee existing ones.</p>
                </div>
                <button onClick={() => {
                    setShowForm(!showForm);
                    if (showForm) {
                        setEditingProjectId(null);
                        setFormData({ name: '', description: '', developers: [], client: '', endDate: '' });
                    }
                }} className="btn btn-primary d-flex align-items-center gap-2 fw-bold shadow-sm">
                    <PlusCircle size={18} /> {showForm ? 'Cancel' : 'New Project'}
                </button>
            </div>

            {showForm && (
                <div className="card shadow-sm border-0 mb-4 rounded-4 bg-light">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-3">{editingProjectId ? 'Edit Project' : 'Create Project'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-medium text-muted">Project Name <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control border-0 shadow-sm" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium text-muted">Assign Developers</label>
                                    <select multiple className="form-select border-0 shadow-sm" value={formData.developers} onChange={handleDeveloperChange} style={{ height: '100px' }}>
                                        {users.filter(u => u.role === 'Developer').map(u => (
                                            <option key={u._id} value={u._id}>{u.username}</option>
                                        ))}
                                    </select>
                                    {users.length === 0 && <small className="text-muted mt-1 d-block">No developers available or user fetch failed.</small>}
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label fw-medium text-muted">Client</label>
                                        <select className="form-select border-0 shadow-sm" value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })}>
                                            <option value="">Select a Client...</option>
                                            {users.filter(u => u.role === 'Client').map(u => (
                                                <option key={u._id} value={u._id}>{u.username}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label fw-medium text-muted">End Date</label>
                                        <input type="date" className="form-control border-0 shadow-sm" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-medium text-muted">Description</label>
                                    <textarea className="form-control border-0 shadow-sm" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                                </div>
                                <div className="col-12 text-end">
                                    <button type="submit" className="btn btn-primary fw-bold px-4 shadow-sm">{editingProjectId ? 'Update Project' : 'Create Project'}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="row g-4">
                {loading ? (
                    <div className="p-5 text-center w-100"><span className="spinner-border text-primary" /></div>
                ) : projects.length === 0 ? (
                    <div className="col-12 text-center text-muted p-5 bg-white rounded-4 shadow-sm border-0">No projects created yet.</div>
                ) : (
                    projects.map(proj => (
                        <div className="col-12 col-xl-6" key={proj._id}>
                            <div className="card shadow-sm border-0 rounded-4 h-100">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="bg-primary text-white p-3 rounded-4 shadow-sm">
                                            <Folder size={24} />
                                        </div>
                                        <div>
                                            <h5 className="fw-bold text-dark mb-1">{proj.name}</h5>
                                            <span className="badge bg-light text-dark border">
                                                <Users size={12} className="me-1" /> {proj.developers?.length || 0} Developers
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-muted mb-4">{proj.description}</p>
                                    
                                    <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                                        <div className="text-muted small d-flex flex-column gap-1">
                                            <span><Calendar size={14} className="me-1" /> Created {new Date(proj.createdAt).toLocaleDateString()}</span>
                                            {proj.endDate && <span><Calendar size={14} className="me-1 text-danger" /> Due {new Date(proj.endDate).toLocaleDateString()}</span>}
                                        </div>
                                        <div className="text-muted small fw-medium text-end">
                                            Admin: {proj.admin?.username || 'System'}<br/>
                                            Client: {proj.client?.username || 'Unassigned'}
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2 justify-content-end mt-3">
                                        <button className="btn btn-sm btn-primary" onClick={() => navigate(`/projects/${proj._id}`)}>View Details</button>
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(proj)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteProject(proj._id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
