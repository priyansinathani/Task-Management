import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { TicketList } from './pages/TicketList';
import { TicketView } from './pages/TicketView';
import { TicketForm } from './components/tickets/TicketForm';
import { AdminPanel } from './pages/AdminPanel';
import { ProjectManagement } from './pages/ProjectManagement';
import { ProjectDetails } from './pages/ProjectDetails';
import { Profile } from './pages/Profile';
import { Requirements } from './pages/Requirements';
import { ClientRequirements } from './pages/ClientRequirements';
import { LiveChat } from './components/chat/LiveChat';

import './styles/main.scss';

// Layout component to wrap authenticated pages
const MainLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-area bg-light">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/tickets/create" element={<div className="container"><TicketForm /></div>} />
          <Route path="/tickets/:id" element={<TicketView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />

          {/* Developer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Developer']} />}>
              <Route path="/requirements" element={<Requirements />} />
          </Route>

          {/* Client Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Client']} />}>
            <Route path="/client-requirements" element={<ClientRequirements />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/requirements" element={<Requirements />} />
            <Route path="/admin/projects" element={<ProjectManagement />} />
            <Route path="/admin/users" element={<AdminPanel />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback routing */}
      <Route path="*" element={<div className="p-5 text-center"><h2>404 Not Found</h2></div>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <LiveChat />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
