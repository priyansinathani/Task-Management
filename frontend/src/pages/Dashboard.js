import React, { useState, useEffect } from 'react';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { TicketChart } from '../components/dashboard/TicketChart';
import { TicketTable } from '../components/tickets/TicketTable';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, AlertOctagon, CheckCircle, FileText, Folder, PlusCircle } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0, warning: 0 });
    const [recentTickets, setRecentTickets] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, projRes] = await Promise.all([
                    api.get('/tickets/dashboard/summary'),
                    api.get('/projects').catch(() => ({ data: [] }))
                ]);
                
                const data = statsRes.data;
                setStats(data.stats || { total: 0, open: 0, resolved: 0, warning: 0 });
                setRecentTickets(data.recentTickets || []);
                setPriorities(data.priorities || []);
                setStatuses(data.statuses || []);
                setTotalProjects(projRes.data.length || 0);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const summaryData = [
        { title: 'Total Projects', count: totalProjects, icon: <Folder size={24} />, color: 'primary' },
        { title: 'Total Tasks', count: stats.total, icon: <FileText size={24} />, color: 'info' },
        { title: 'Resolved Tasks', count: stats.resolved, icon: <CheckCircle size={24} />, color: 'success' },
        { title: 'High Priority', count: stats.warning, icon: <AlertOctagon size={24} />, color: 'danger', subtitle: 'Requires attention!' }
    ];

    const barChartData = statuses.length ? statuses : [
        { name: 'To Do', value: 0 },
        { name: 'In Progress', value: 0 },
        { name: 'Done', value: 0 }
    ];

    const pieChartData = priorities.length ? priorities : [
        { name: 'High', value: 0 },
        { name: 'Medium', value: 0 },
        { name: 'Low', value: 0 },
        { name: 'Critical', value: 0 }
    ];

    if (loading) {
        return <div className="d-flex justify-content-center align-items-center vh-100"><span className="spinner-border text-primary" /></div>;
    }

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-1">Dashboard</h3>
                    <p className="text-muted mb-0">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="d-flex gap-3">
                    {user?.role === 'Client' && (
                        <button onClick={() => navigate('/tickets/create')} className="btn btn-success d-flex align-items-center gap-2 px-3 fw-bold shadow-sm">
                            <PlusCircle size={18} /> Create Ticket
                        </button>
                    )}
                    <button className="btn btn-primary d-flex align-items-center gap-2 px-3 fw-bold shadow-sm">
                        <FileText size={18} /> Generate Report
                    </button>
                </div>
            </div>

            <div className="row g-4 mb-4">
                {summaryData.map((data, index) => (
                    <div className="col-12 col-sm-6 col-xl-3" key={index}>
                        <SummaryCard {...data} />
                    </div>
                ))}
            </div>

            <div className="row g-4 mb-4">
                <div className="col-lg-8">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-header bg-white border-bottom p-4">
                            <h5 className="mb-0 fw-bold">Tasks by Status</h5>
                        </div>
                        <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center">
                            <TicketChart type="bar" data={barChartData} />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-header bg-white border-bottom p-4">
                            <h5 className="mb-0 fw-bold">Priority Distribution</h5>
                        </div>
                        <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center">
                            <TicketChart type="pie" data={pieChartData} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <TicketTable tickets={recentTickets} />
                </div>
            </div>
        </div>
    );
};
