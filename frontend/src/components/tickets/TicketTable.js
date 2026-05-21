import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { Search, Filter, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const TicketTable = ({ tickets }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.id.toString().includes(searchTerm);
        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
        const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
    const displayTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-white border-bottom p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                    Ticket List
                    <span className="badge bg-light text-dark fw-bold px-3 py-1 border">{filteredTickets.length}</span>
                </h5>

                <div className="d-flex flex-wrap gap-3 flex-grow-1 justify-content-md-end">
                    <div className="input-group" style={{ maxWidth: '300px' }}>
                        <span className="input-group-text bg-light border-end-0">
                            <Search size={18} className="text-secondary" />
                        </span>
                        <input
                            type="text"
                            className="form-control bg-light border-start-0 ps-0"
                            placeholder="Search by ID or Title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Filter size={18} className="text-secondary d-none d-md-block" />
                        <select
                            className="form-select bg-light border-0"
                            style={{ width: '130px' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <select
                            className="form-select bg-light border-0"
                            style={{ width: '130px' }}
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <option value="All">All Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light text-uppercase text-secondary" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                        <tr>
                            <th className="py-3 ps-4 border-0">Ticket ID</th>
                            <th className="py-3 border-0">Title</th>
                            <th className="py-3 border-0">Status</th>
                            <th className="py-3 border-0">Priority</th>
                            <th className="py-3 border-0">Created At</th>
                            <th className="py-3 pe-4 border-0 text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayTickets.length > 0 ? (
                            displayTickets.map((ticket) => (
                                <tr key={ticket.id} className="bg-white border-bottom">
                                    <td className="ps-4 fw-bold">#{ticket.id}</td>
                                    <td className="fw-medium text-dark">{ticket.title}</td>
                                    <td><StatusBadge status={ticket.status} /></td>
                                    <td>
                                        <span className={`badge px-3 py-1 rounded-pill bg-${ticket.priority === 'High' ? 'danger' : ticket.priority === 'Medium' ? 'warning text-dark' : 'info'}-subtle text-${ticket.priority === 'High' ? 'danger' : 'dark'}`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="text-secondary px-3">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                    <td className="pe-4 text-end">
                                        <Link to={`/tickets/${ticket.id}`} className="btn btn-sm btn-light btn-icon rounded-circle d-inline-flex align-items-center justify-content-center p-2 text-primary hover-shadow">
                                            <ArrowUpRight size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-5 text-muted fw-bold">
                                    No tickets found matching your criteria
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="card-footer bg-white border-top p-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                <span className="text-muted small fw-medium">
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredTickets.length)} to {Math.min(currentPage * itemsPerPage, filteredTickets.length)} of {filteredTickets.length} entries
                </span>
                <div className="d-flex align-items-center gap-2">
                    <button
                        className="btn btn-sm btn-light d-flex align-items-center px-3 gap-1 fw-bold rounded-pill text-dark"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={16} /> Prev
                    </button>

                    <div className="d-flex gap-1">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                                key={idx}
                                className={`btn btn-sm rounded-circle d-flex align-items-center justify-content-center fw-bold ${currentPage === idx + 1 ? 'btn-primary' : 'btn-light'}`}
                                style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}
                                onClick={() => handlePageChange(idx + 1)}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        className="btn btn-sm btn-light d-flex align-items-center px-3 gap-1 fw-bold rounded-pill text-dark"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
