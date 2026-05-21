import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

function Layout({ children, theme, toggleTheme }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-container fade-in">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="main-content">
                <Header
                    theme={theme}
                    toggleTheme={toggleTheme}
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />
                <main className="page-content fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;
