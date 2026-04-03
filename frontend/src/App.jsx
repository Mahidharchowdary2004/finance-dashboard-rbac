import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Users from './pages/Users';

// Components
import Sidebar from './components/Sidebar';

// Role-Based Protected Route Component
const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div style={{ padding: '2rem' }}>Processing authorization...</div>;
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    // Check if the user's role is allowed for this route
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }
    
    return children;
};

// Main Layout Wrapper
const DashboardLayout = ({ children }) => {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected Dashboard Routes */}
                    <Route path="/" element={
                        <RoleProtectedRoute>
                            <DashboardLayout>
                                <Dashboard />
                            </DashboardLayout>
                        </RoleProtectedRoute>
                    } />
                    
                    <Route path="/records" element={
                        <RoleProtectedRoute allowedRoles={['Analyst', 'Admin']}>
                            <DashboardLayout>
                                <Records />
                            </DashboardLayout>
                        </RoleProtectedRoute>
                    } />
                    
                    <Route path="/users" element={
                        <RoleProtectedRoute allowedRoles={['Admin']}>
                            <DashboardLayout>
                                <Users />
                            </DashboardLayout>
                        </RoleProtectedRoute>
                    } />
                    
                    {/* Catch-all Redirect */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
