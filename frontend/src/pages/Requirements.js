import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { ArrowRight, FileText, CheckCircle, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Modal, Button, Form } from 'react-bootstrap';

export const Requirements = () => {
    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Conversion Modal States
    const [showModal, setShowModal] = useState(false);
    const [convertingReq, setConvertingReq] = useState(null);
    const [developers, setDevelopers] = useState([]);
    const [selectedDeveloper, setSelectedDeveloper] = useState('');

    useEffect(() => {
        fetchRequirements();
    }, []);

    const fetchRequirements = async () => {
        try {
            const res = await api.get('/requirements');
            setRequirements(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchDevelopers = async () => {
        try {
            const res = await api.get('/auth/users');
            setDevelopers(res.data.filter(u => u.role?.toLowerCase() === 'developer'));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user?.role === 'Admin') {
            fetchDevelopers();
        }
    }, [user]);

    const convertToTask = (req) => {
        setConvertingReq(req);
        setSelectedDeveloper('');
        setShowModal(true);
    };

    const confirmConversion = async () => {
        if (!convertingReq || !selectedDeveloper) return;
        try {
            await api.post('/tickets', {
                title: convertingReq.title,
                description: `Requested by Client:\n\n${convertingReq.description}`,
                priority: 'Medium',
                status: 'To Do',
                project: convertingReq.project?._id,
                assignee: selectedDeveloper
            });

            await api.patch(`/requirements/${convertingReq._id}/status`, { status: 'Converted', developer: selectedDeveloper });
            
            setRequirements(prev => prev.map(r => r._id === convertingReq._id ? { ...r, status: 'Converted' } : r));
            setShowModal(false);
            setConvertingReq(null);
        } catch (err) {
            console.error("Failed to convert requirement", err);
        }
    };

    return (
        <div className="container-fluid py-4 h-100 flex-grow-1 overflow-auto">
            <div className="mb-4">
                <h3 className="fw-bold mb-1">Incoming Requirements</h3>
                <p className="text-muted mb-0">Review client requests and convert them into actionable tasks.</p>
            </div>

            <div className="row g-4">
                {loading ? (
                    <div className="p-5 text-center w-100"><span className="spinner-border text-primary" /></div>
                ) : requirements.length === 0 ? (
                    <div className="col-12 text-center text-muted p-5 bg-white rounded-3 border">No incoming requirements found.</div>
                ) : (
                    requirements.map(req => (
                        <div className="col-12" key={req._id}>
                            <div className="card shadow-sm border-0 rounded-4">
                                <div className="card-body p-4">
                                    <div className="row align-items-center">
                                        <div className="col-md-7 mb-3 mb-md-0">
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <span className={`badge ${req.status === 'Converted' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                    {req.status}
                                                </span>
                                                <span className="text-muted small border-start ps-2 border-2 d-flex align-items-center gap-1">
                                                    <Clock size={12}/> {new Date(req.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h5 className="fw-bold text-dark mb-2">{req.title}</h5>
                                            <p className="text-muted mb-0 lh-base">{req.description}</p>
                                        </div>
                                        <div className="col-md-2 mb-3 mb-md-0 border-start d-flex flex-column justify-content-center">
                                            <div className="d-flex align-items-center gap-2 mb-2 text-muted small">
                                                <FileText size={16} /> <span className="fw-medium text-dark text-truncate">{req.project?.name || 'No Project'}</span>
                                            </div>
                                            <div className="d-flex align-items-center gap-2 text-muted small">
                                                <User size={16} /> <span>{req.client?.username || 'Unknown Client'}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-3 text-md-end">
                                            {req.status === 'Pending' ? (
                                                user?.role === 'Admin' ? (
                                                    <button 
                                                        onClick={() => convertToTask(req)}
                                                        className="btn btn-primary d-inline-flex align-items-center gap-2 fw-bold shadow-sm"
                                                    >
                                                        Convert to Task <ArrowRight size={16} />
                                                    </button>
                                                ) : (
                                                    <button className="btn btn-light text-warning fw-bold d-inline-flex align-items-center gap-2" disabled>
                                                        <Clock size={16} /> Pending Admin Review
                                                    </button>
                                                )
                                            ) : (
                                                <button className="btn btn-light text-success fw-bold d-inline-flex align-items-center gap-2" disabled>
                                                    <CheckCircle size={16} /> Converted
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Conversion Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">Convert to Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted mb-4">Assign a developer to handle this client requirement.</p>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold fs-6">Requirement Title</Form.Label>
                        <Form.Control type="text" value={convertingReq?.title || ''} disabled readOnly className="bg-light" />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold fs-6">Assign Developer</Form.Label>
                        <Form.Select 
                            value={selectedDeveloper} 
                            onChange={(e) => setSelectedDeveloper(e.target.value)}
                        >
                            <option value="" disabled>Select a developer...</option>
                            {developers.map(dev => (
                                <option key={dev._id} value={dev._id}>{dev.username} ({dev.email})</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" className="fw-bold" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" className="fw-bold px-4" onClick={confirmConversion} disabled={!selectedDeveloper}>Convert & Assign</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
