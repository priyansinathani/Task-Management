import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { PlusCircle, FileText, CheckCircle, Clock } from 'lucide-react';

export const ClientRequirements = () => {
    const [requirements, setRequirements] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingReqId, setEditingReqId] = useState(null);
    
    const [formData, setFormData] = useState({ title: '', description: '', project: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const reqRes = await api.get('/requirements');
            setRequirements(reqRes.data);

            const projRes = await api.get('/projects');
            setProjects(projRes.data);
            
            if (projRes.data.length > 0) {
                setFormData(prev => ({ ...prev, project: projRes.data[0]._id }));
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let submitData = { ...formData, project: formData.project || null };
            if (editingReqId) {
                const res = await api.patch(`/requirements/${editingReqId}`, submitData);
                setRequirements(requirements.map(r => r._id === editingReqId ? res.data : r));
                setEditingReqId(null);
            } else {
                const res = await api.post('/requirements', submitData);
                setRequirements([res.data, ...requirements]);
            }
            setShowForm(false);
            setFormData({ title: '', description: '', project: projects[0]?._id || '' });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleEditClick = (req) => {
        setFormData({
            title: req.title,
            description: req.description,
            project: req.project?._id || ''
        });
        setEditingReqId(req._id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (id) => {
        if(window.confirm("Are you sure you want to delete this requirement?")) {
            try {
                await api.delete(`/requirements/${id}`);
                setRequirements(requirements.filter(r => r._id !== id));
            } catch (err) {
                console.error(err);
                alert("Failed to delete requirement.");
            }
        }
    };

    return (
        <div className="container-fluid py-4 h-100 flex-grow-1 overflow-auto">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-1">My Requirements</h3>
                    <p className="text-muted mb-0">Submit new feature requirements or bug reports.</p>
                </div>
                <button onClick={() => {
                    setShowForm(!showForm);
                    if (showForm) {
                        setEditingReqId(null);
                        setFormData({ title: '', description: '', project: projects[0]?._id });
                    }
                }} className="btn btn-primary d-flex align-items-center gap-2 fw-bold shadow-sm">
                    <PlusCircle size={18} /> {showForm ? 'Cancel' : 'Submit Requirement'}
                </button>
            </div>

            {showForm && (
                <div className="card shadow-sm border-0 mb-4 rounded-4">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-3">{editingReqId ? 'Edit Requirement' : 'New Requirement'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-medium text-muted">Project</label>
                                <select className="form-select bg-light border-0" value={formData.project} onChange={e => setFormData({ ...formData, project: e.target.value })}>
                                    <option value="">General (No specific project)</option>
                                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-medium text-muted">Title</label>
                                <input type="text" className="form-control bg-light border-0" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-medium text-muted">Description</label>
                                <textarea className="form-control bg-light border-0" rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary fw-bold px-4 shadow-sm">{editingReqId ? 'Update Requirement' : 'Submit to Developers'}</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="row g-3">
                {loading ? (
                    <div className="p-5 text-center w-100"><span className="spinner-border text-primary" /></div>
                ) : requirements.length === 0 ? (
                    <div className="col-12 text-center text-muted p-5 bg-white rounded-3 border">No requirements submitted yet.</div>
                ) : (
                    requirements.map(req => (
                        <div className="col-12 col-md-6 col-xxl-4" key={req._id}>
                            <div className="card border-0 shadow-sm rounded-4 h-100">
                                <div className="card-body p-4 d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <span className={`badge ${req.status === 'Converted' ? 'bg-success-subtle text-success border border-success' : 'bg-warning-subtle text-warning border border-warning'}`}>
                                            {req.status}
                                        </span>
                                        <small className="text-muted d-flex align-items-center gap-1"><Clock size={12}/>{new Date(req.createdAt).toLocaleDateString()}</small>
                                    </div>
                                    <h6 className="fw-bold text-dark">{req.title}</h6>
                                    <p className="text-muted small mb-3 flex-grow-1">{req.description}</p>
                                    <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
                                        <div className="d-flex align-items-center gap-2">
                                            <FileText size={16} className="text-muted" />
                                            <span className="small fw-medium text-secondary">{req.project?.name || 'Unknown Project'}</span>
                                        </div>
                                        {req.status === 'Pending' && (
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-sm btn-outline-primary py-0 px-2" onClick={() => handleEditClick(req)}>Edit</button>
                                                <button className="btn btn-sm btn-outline-danger py-0 px-2" onClick={() => handleDeleteClick(req._id)}>Delete</button>
                                            </div>
                                        )}
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
