import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, PieChart, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    
    const activeStyle = ({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link';

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <PieChart size={32} />
                <span>FinDash</span>
            </div>
            
            <nav className="sidebar-nav">
                <NavLink to="/" className={activeStyle}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                {user?.role !== 'Viewer' && (
                    <NavLink to="/records" className={activeStyle}>
                        <ReceiptText size={20} />
                        <span>Records</span>
                    </NavLink>
                )}
                {user?.role === 'Admin' && (
                    <NavLink to="/users" className={activeStyle}>
                        <UserIcon size={20} />
                        <span>Users</span>
                    </NavLink>
                )}
            </nav>
            
            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="text-sm font-bold">{user?.name}</div>
                        <div className="text-muted text-sm">{user?.role}</div>
                    </div>
                </div>
                <button onClick={logout} className="sidebar-link" style={{ width: '100%', border: 'none', background: 'none' }}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
