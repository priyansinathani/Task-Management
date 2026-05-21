import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StatusBadge } from '../components/tickets/StatusBadge';
import { SLATimer } from '../components/tickets/SLATimer';
import { User, Clock, ArrowLeft, MessageSquare, Paperclip, Send } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export const TicketView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', description: '' });

    useEffect(() => {
        fetchTicketData();
    }, [id]);

    const fetchTicketData = async () => {
        try {
            const ticketRes = await api.get(`/tickets/${id}`);
            setTicket(ticketRes.data);

            const commentsRes = await api.get(`/comments/task/${id}`);
            setComments(commentsRes.data);
            
            const usersRes = await api.get('/auth/users');
            setUsers(usersRes.data.filter(u => u.role === 'Developer' || u.role === 'Admin'));

            setLoading(false);
        } catch (err) {
            console.error("Error fetching ticket data", err);
            setLoading(false);
        }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setTicket({ ...ticket, status: newStatus });
        try {
            await api.patch(`/tickets/${id}`, { status: newStatus });
        } catch (err) {
            console.error("Error updating status", err);
        }
    };

    const handleAssigneeChange = async (e) => {
        const newAssigneeId = e.target.value;
        
        // Optimistically update UI
        const selectedUser = users.find(u => u._id === newAssigneeId);
        setTicket({ 
            ...ticket, 
            assignee: newAssigneeId ? { _id: newAssigneeId, username: selectedUser?.username } : null 
        });

        try {
            await api.patch(`/tickets/${id}`, { assignee: newAssigneeId || null });
        } catch (err) {
            console.error("Error updating assignee", err);
        }
    };

    const submitComment = async (e) => {
        e.preventDefault();
        if (comment.trim() === '') return;
        
        try {
            const res = await api.post('/comments', { task: id, text: comment });
            setComments([...comments, res.data]);
            setComment('');
        } catch (err) {
            console.error("Error submitting comment", err);
        }
    };

    if (loading) return <div className="p-5 text-center"><span className="spinner-border text-primary" /></div>;
    if (!ticket) return <div className="p-5 text-center text-danger"><h4 className="fw-bold">Ticket not found</h4></div>;

    const workflows = ['To Do', 'In Progress', 'Done'];
    let normalizedStatus = ticket.status;
    if (['Open'].includes(ticket.status)) normalizedStatus = 'To Do';
    if (['Closed', 'Resolved'].includes(ticket.status)) normalizedStatus = 'Done';

    const currentStep = workflows.indexOf(normalizedStatus) === -1 ? 0 : workflows.indexOf(normalizedStatus);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
            try {
                await api.delete(`/tickets/${id}`);
                navigate('/tickets');
            } catch (err) {
                console.error("Error deleting ticket", err);
                alert("Failed to delete ticket.");
            }
        }
    };

    const handleSaveEdit = async () => {
        try {
            const res = await api.patch(`/tickets/${id}`, editForm);
            setTicket(res.data);
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating ticket details", err);
            alert("Failed to update task.");
        }
    };

    return (
        <div className="container-fluid py-4 h-100 flex-grow-1 overflow-auto">
            <div className="d-flex align-items-center mb-4 gap-3">
                <button onClick={() => navigate(-1)} className="btn btn-light btn-icon shadow-sm rounded-circle d-flex align-items-center justify-content-center p-2">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h3 className="fw-bold mb-1">Task Details</h3>
                    <p className="text-muted mb-0">{ticket.project?.name || 'Backlog Task'}</p>
                </div>
                <div className="ms-auto d-flex align-items-center gap-3">
                    {ticket.deadline && <div className="d-none d-md-block"><SLATimer deadline={ticket.deadline} /></div>}
                    
                    {user?.role === 'Admin' || (user?.role === 'Developer' && ticket.assignee?._id === user?._id) ? (
                        <button 
                            className="btn btn-outline-primary btn-sm fw-bold px-3 shadow-sm"
                            onClick={() => {
                                setEditForm({ title: ticket.title, description: ticket.description });
                                setIsEditing(!isEditing);
                            }}
                        >
                            {isEditing ? 'Cancel Edit' : 'Edit Details'}
                        </button>
                    ) : null}
                    
                    {user?.role === 'Admin' && (
                        <button 
                            className="btn btn-danger btn-sm fw-bold px-3 shadow-sm"
                            onClick={handleDelete}
                        >
                            Delete Task
                        </button>
                    )}
                </div>
            </div>

            <div className="row g-4 pb-4">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 mb-4 rounded-4 overflow-hidden">
                        <div className="card-header bg-white p-4 border-bottom d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 text-dark">Task Description</h5>
                            <StatusBadge status={normalizedStatus} />
                        </div>

                        <div className="card-body p-4">
                            <div className="mb-5 position-relative">
                                <div className="d-flex justify-content-between align-items-center mb-2 px-1">
                                    {workflows.map((wf, idx) => (
                                        <div key={wf} className="text-center position-relative z-1" style={{ width: '80px' }}>
                                            <div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 fw-bold 
                        ${idx <= currentStep ? 'bg-primary text-white' : 'bg-light text-muted border'}`}
                                                style={{ width: '32px', height: '32px', transition: 'all 0.3s' }}>
                                                {idx + 1}
                                            </div>
                                            <small className={`fw-semibold ${idx <= currentStep ? 'text-primary' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>{wf}</small>
                                        </div>
                                    ))}
                                </div>
                                <div className="position-absolute bg-light w-100" style={{ height: '4px', top: '14px', zIndex: 0 }}>
                                    <div className="bg-primary h-100" style={{ width: `${(currentStep / (workflows.length - 1)) * 100}%`, transition: 'width 0.5s ease-in-out' }}></div>
                                </div>
                            </div>

                            <div className="p-4 bg-light rounded-3 mb-4 border">
                                {isEditing ? (
                                    <div className="d-flex flex-column gap-3">
                                        <input 
                                            type="text" 
                                            className="form-control fw-bold fs-5" 
                                            value={editForm.title} 
                                            onChange={(e) => setEditForm({...editForm, title: e.target.value})} 
                                        />
                                        <textarea 
                                            className="form-control" 
                                            rows="5" 
                                            value={editForm.description} 
                                            onChange={(e) => setEditForm({...editForm, description: e.target.value})} 
                                        />
                                        <div className="d-flex justify-content-end mt-2">
                                            <button className="btn btn-success fw-bold px-4 shadow-sm" onClick={handleSaveEdit}>Save Changes</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h5 className="fw-bold mb-3">{ticket.title}</h5>
                                        <p className="text-dark mb-0 lh-lg" style={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
                                    </>
                                )}
                            </div>

                            <h6 className="fw-bold mb-3 pb-2 border-bottom d-flex align-items-center gap-2"><MessageSquare size={18} /> Discussion</h6>

                            <div className="d-flex flex-column gap-3 mb-4">
                                {comments.length === 0 && <p className="text-muted small">No comments yet.</p>}
                                {comments.map(c => {
                                    const isStaff = c.user?.role === 'Admin' || c.user?.role === 'Developer';
                                    const isCurrentUser = c.user?._id === user?._id;
                                    
                                    return (
                                    <div key={c._id} className={`d-flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                                        <div className={`text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm ${isStaff ? 'bg-danger' : 'bg-secondary'}`} style={{ width: '40px', height: '40px' }} title={c.user?.role}>
                                            <span className="fw-bold">{c.user?.username.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div className={`p-3 rounded-3 shadow-sm ${isCurrentUser ? 'bg-primary text-white' : 'bg-light border'}`} style={{ maxWidth: '80%' }}>
                                            <div className="d-flex justify-content-between align-items-center mb-2 gap-4">
                                                <span className="fw-bold small">{c.user?.username} <small className={isCurrentUser ? 'text-white-50' : 'text-muted'}>({c.user?.role})</small></span>
                                                <span className={`small ${isCurrentUser ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>{new Date(c.createdAt).toLocaleString()}</span>
                                            </div>
                                            <p className="mb-0 small leading-relaxed">{c.text}</p>
                                        </div>
                                    </div>
                                )})}
                            </div>

                            <form onSubmit={submitComment} className="mt-4">
                                <div className="position-relative">
                                    <textarea
                                        className="form-control bg-light border p-3 rounded-3 pe-5"
                                        rows="3"
                                        placeholder="Type your reply here..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    ></textarea>
                                    <div className="position-absolute bottom-0 end-0 p-2 d-flex gap-2">
                                        <button type="button" className="btn btn-light btn-sm btn-icon text-muted p-2 rounded-circle hover-shadow"><Paperclip size={18} /></button>
                                        <button type="submit" disabled={!comment.trim()} className="btn btn-primary btn-sm btn-icon p-2 rounded-circle shadow-sm"><Send size={18} /></button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-header bg-white p-4 border-bottom">
                            <h5 className="fw-bold mb-0">Properties</h5>
                        </div>
                        <div className="card-body p-4">
                            <div className="mb-4">
                                <label className="form-label text-muted fw-bold small text-uppercase">Update Status</label>
                                <select 
                                    className="form-select bg-light border-0 py-2 fw-medium shadow-none" 
                                    value={normalizedStatus} 
                                    onChange={handleStatusChange}
                                    disabled={user?.role === 'Client' || (user?.role === 'Developer' && ticket.assignee?._id !== user?._id)}
                                >
                                    {workflows.map(wf => <option key={wf} value={wf}>{wf}</option>)}
                                </select>
                            </div>
                            
                            <div className="mb-4">
                                <label className="form-label text-muted fw-bold small text-uppercase">Assignee</label>
                                <select 
                                    className="form-select bg-light border-0 py-2 fw-medium shadow-none" 
                                    value={ticket.assignee?._id || ''} 
                                    onChange={handleAssigneeChange}
                                    disabled={user?.role !== 'Admin'}
                                >
                                    <option value="">Unassigned</option>
                                    {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
                                </select>
                            </div>

                            <ul className="list-group list-group-flush mb-0">
                                <li className="list-group-item px-0 py-3 bg-transparent d-flex justify-content-between align-items-center border-bottom-dashed">
                                    <span className="text-muted">Priority</span>
                                    <span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-1">{ticket.priority}</span>
                                </li>
                                <li className="list-group-item px-0 py-3 bg-transparent d-flex justify-content-between align-items-center border-bottom-dashed">
                                    <span className="text-muted">Project</span>
                                    <span className="fw-medium text-dark">{ticket.project?.name || 'None'}</span>
                                </li>
                                <li className="list-group-item px-0 py-3 bg-transparent d-flex justify-content-between align-items-center">
                                    <span className="text-muted d-flex align-items-center gap-2"><Clock size={16} /> Created</span>
                                    <span className="fw-medium text-dark">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
