import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Folder, CheckCircle, Clock } from 'lucide-react';
import api from '../utils/api';

export const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [taskData, setTaskData] = useState({ title: '', description: '', priority: 'Medium', assignee: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projRes, tickRes] = await Promise.all([
                    api.get(`/projects/${id}`),
                    api.get(`/tickets?projectId=${id}`)
                ]);
                setProject(projRes.data);
                setTickets(tickRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="p-5 text-center"><span className="spinner-border text-primary" /></div>;
    if (!project) return <div className="p-5 text-center"><h4>Project not found</h4></div>;

    // Group tickets by Assignee
    const getTasksForDeveloper = (devId) => {
        return tickets.filter(t => t.assignee && (t.assignee._id === devId || t.assignee === devId));
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/tickets', {
                ...taskData,
                project: id
            });
            // Refetch tickets to get populated assignee info, or manually construct it
            const tickRes = await api.get(`/tickets?projectId=${id}`);
            setTickets(tickRes.data);
            setShowTaskForm(false);
            setTaskData({ title: '', description: '', priority: 'Medium', assignee: '' });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || err.message);
        }
    };

    const unassignedTasks = tickets.filter(t => !t.assignee);

    return (
        <div className="container-fluid py-4 h-100 flex-grow-1 overflow-auto">
            <Link to="/admin/projects" className="btn btn-link text-decoration-none p-0 mb-3 d-flex align-items-center gap-2 text-muted">
                <ArrowLeft size={18} /> Back to Projects
            </Link>

            <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-body p-4 p-md-5">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="bg-primary text-white p-3 rounded-circle d-flex align-items-center justify-content-center">
                            <Folder size={28} />
                        </div>
                        <div>
                            <h2 className="fw-bold mb-0">{project.name}</h2>
                            <span className="badge bg-light text-dark border mt-2">Managed by: {project.admin?.username}</span>
                        </div>
                    </div>
                    <p className="text-muted fs-5 mb-0">{project.description}</p>
                    <hr className="my-4" />
                    <button className="btn btn-primary fw-bold" onClick={() => setShowTaskForm(!showTaskForm)}>
                        {showTaskForm ? 'Cancel Task Creation' : 'Create New Task'}
                    </button>
                </div>
            </div>

            {showTaskForm && (
                <div className="card shadow-sm border-0 mb-4 rounded-4 bg-light">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-3">Create New Task</h5>
                        <form onSubmit={handleCreateTask}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-medium text-muted">Task Title <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control border-0 shadow-sm" value={taskData.title} onChange={e => setTaskData({ ...taskData, title: e.target.value })} required />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-medium text-muted">Priority</label>
                                    <select className="form-select border-0 shadow-sm" value={taskData.priority} onChange={e => setTaskData({ ...taskData, priority: e.target.value })}>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-medium text-muted">Assignee</label>
                                    <select className="form-select border-0 shadow-sm" value={taskData.assignee} onChange={e => setTaskData({ ...taskData, assignee: e.target.value })}>
                                        <option value="">Unassigned</option>
                                        {project.developers.map(dev => (
                                            <option key={dev._id} value={dev._id}>{dev.username}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-medium text-muted">Description</label>
                                    <textarea className="form-control border-0 shadow-sm" rows="3" value={taskData.description} onChange={e => setTaskData({ ...taskData, description: e.target.value })} required></textarea>
                                </div>
                                <div className="col-12 text-end">
                                    <button type="submit" className="btn btn-primary fw-bold px-4 shadow-sm">Assign Task</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <Users className="text-primary" /> Team Workload
            </h4>

            <div className="row g-4">
                {project.developers.length === 0 ? (
                    <div className="col-12 text-center p-5 bg-light rounded-4">
                        <Users size={48} className="text-muted opacity-50 mb-3" />
                        <h5>No developers are assigned to this project yet.</h5>
                    </div>
                ) : (
                    project.developers.map(dev => {
                        const devTasks = getTasksForDeveloper(dev._id);
                        const doneCount = devTasks.filter(t => t.status === 'Done').length;
                        const openCount = devTasks.length - doneCount;

                        return (
                            <div className="col-lg-6 col-xl-4" key={dev._id}>
                                <div className="card shadow-sm border-0 rounded-4 h-100">
                                    <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 35, height: 35 }}>
                                                {dev.username.charAt(0).toUpperCase()}
                                            </div>
                                            <h6 className="mb-0 fw-bold">{dev.username}</h6>
                                        </div>
                                        <span className="badge bg-light text-dark border">{devTasks.length} Tasks</span>
                                    </div>
                                    <div className="card-body p-0">
                                        {devTasks.length === 0 ? (
                                            <div className="p-4 text-center text-muted small">No tasks assigned.</div>
                                        ) : (
                                            <ul className="list-group list-group-flush">
                                                {devTasks.map(task => (
                                                    <li key={task._id} className="list-group-item p-3 border-0 border-bottom d-flex justify-content-between align-items-start bg-transparent">
                                                        <div>
                                                            <Link to={`/tickets/${task._id}`} className="fw-medium text-dark text-decoration-none">
                                                                {task.title}
                                                            </Link>
                                                            <div className="d-flex gap-2 mt-1">
                                                                <span className={`badge bg-${task.priority === 'High' || task.priority === 'Critical' ? 'danger' : 'info'} bg-opacity-10 text-${task.priority === 'High' || task.priority === 'Critical' ? 'danger' : 'primary'} border-0`}>
                                                                    {task.priority}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {task.status === 'Done' ? (
                                                            <CheckCircle size={18} className="text-success mt-1" />
                                                        ) : (
                                                            <Clock size={18} className="text-warning mt-1" />
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="card-footer bg-light border-top-0 d-flex justify-content-between text-muted small p-3 rounded-bottom-4">
                                        <span><CheckCircle size={14} className="me-1 text-success"/> {doneCount} Done</span>
                                        <span><Clock size={14} className="me-1 text-warning"/> {openCount} Open</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                
                {unassignedTasks.length > 0 && (
                    <div className="col-12 mt-5">
                        <h5 className="fw-bold mb-3 text-muted">Unassigned Tasks ({unassignedTasks.length})</h5>
                        <div className="card shadow-sm border-0 rounded-4">
                            <ul className="list-group list-group-flush">
                                {unassignedTasks.map(task => (
                                    <li key={task._id} className="list-group-item p-3 d-flex justify-content-between align-items-center">
                                        <Link to={`/tickets/${task._id}`} className="fw-medium text-dark text-decoration-none">
                                            {task.title}
                                        </Link>
                                        <span className={`badge ${task.status === 'Done' ? 'bg-success' : 'bg-secondary'}`}>{task.status}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
