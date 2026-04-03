import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { User as UserIcon, Trash, Mail, Power, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

const Users = () => {
    const { isAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null });

    const fetchUsers = async () => {
        try {
            const response = await api.get('/auth/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) fetchUsers();
    }, [isAdmin]);

    // Derived filtered users list
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === '' || user.role === roleFilter;
        const matchesStatus = statusFilter === '' || user.status === statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.patch(`/auth/users/${userId}/role`, { role: newRole });
            fetchUsers();
        } catch (error) {
            alert('Failed to update role');
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
            await api.patch(`/auth/users/${userId}/status`, { status: newStatus });
            fetchUsers();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleDeleteUser = async () => {
        const userId = deleteModal.userId;
        try {
            await api.delete(`/auth/users/${userId}`);
            fetchUsers();
            setDeleteModal({ isOpen: false, userId: null });
        } catch (error) {
            alert(error.displayMessage || 'Failed to delete user');
        }
    };

    if (!isAdmin) return <div className="main-content">Access Denied</div>;

    return (
        <div>
            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Delete User?"
                message="Are you sure you want to delete this user? This action cannot be undone."
                onConfirm={handleDeleteUser}
                onCancel={() => setDeleteModal({ isOpen: false, userId: null })}
            />
            <header className="mb-8">
                <h1 className="text-2xl font-bold">User Management</h1>
                <p className="text-muted">Directly manage user roles, status, and accounts.</p>
            </header>

            {/* Filter Card */}
            <div className="card mb-8">
                <div 
                    className="flex flex-column md:flex-row gap-4 items-center" 
                    style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1.5rem' }}
                >
                    <div className="flex-1" style={{ minWidth: '250px' }}>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="text-sm"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-muted">Role:</span>
                        <select 
                            value={roleFilter} 
                            onChange={(e) => setRoleFilter(e.target.value)}
                            style={{ width: 'auto', padding: '0.6rem 1rem' }}
                        >
                            <option value="">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Analyst">Analyst</option>
                            <option value="Viewer">Viewer</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-muted">Status:</span>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ width: 'auto', padding: '0.6rem 1rem' }}
                        >
                            <option value="">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <button 
                        onClick={() => { setSearchTerm(''); setRoleFilter(''); setStatusFilter(''); }}
                        className="text-sm text-primary font-bold bg-transparent"
                        style={{ marginLeft: 'auto' }}
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: '0' }}>
                {loading ? <p style={{ padding: '2rem' }}>Loading users...</p> : (
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center" style={{ padding: '3rem' }}>
                                            <div className="text-muted">No users found matching your criteria.</div>
                                        </td>
                                    </tr>
                                ) : filteredUsers.map(u => (
                                    <tr key={u._id}>
                                        <td>
                                            <div className="flex items-center gap-4">
                                                <div className="user-avatar" style={{ 
                                                    width: '42px', 
                                                    height: '42px', 
                                                    background: u.role === 'Admin' ? 'var(--primary)' : '#e2e8f0',
                                                    color: u.role === 'Admin' ? 'white' : 'var(--text)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '12px',
                                                    fontWeight: '800',
                                                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)',
                                                    fontSize: '1.1rem'
                                                }}>
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <div className="font-bold" style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>{u.name}</div>
                                                    <div className="text-xs text-muted flex items-center gap-2">
                                                        <Mail size={12} strokeWidth={2.5} /> {u.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <select 
                                                className="text-xs font-bold" 
                                                style={{ 
                                                    width: 'auto', 
                                                    padding: '0.4rem 0.8rem', 
                                                    borderRadius: '8px',
                                                    opacity: (u.role === 'Admin' && users.filter(usr => usr.role === 'Admin').length <= 1) ? 0.6 : 1,
                                                    cursor: (u.role === 'Admin' && users.filter(usr => usr.role === 'Admin').length <= 1) ? 'not-allowed' : 'pointer'
                                                }}
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                disabled={u.role === 'Admin' && users.filter(usr => usr.role === 'Admin').length <= 1}
                                                title={u.role === 'Admin' && users.filter(usr => usr.role === 'Admin').length <= 1 ? "Cannot downgrade the only administrator" : ""}
                                            >
                                                <option value="Viewer">Viewer</option>
                                                <option value="Analyst">Analyst</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button 
                                                onClick={() => handleStatusToggle(u._id, u.status)}
                                                className={`badge ${u.status === 'Active' ? 'badge-income' : 'badge-expense'}`}
                                                style={{ border: 'none', cursor: 'pointer', letterSpacing: '0.02em' }}
                                            >
                                                {u.status}
                                            </button>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button 
                                                onClick={() => setDeleteModal({ isOpen: true, userId: u._id })} 
                                                className="bg-transparent" 
                                                style={{ 
                                                    color: 'var(--danger)', 
                                                    padding: '0.5rem', 
                                                    transition: 'transform 0.2s',
                                                    opacity: (u._id === localStorage.getItem('userId') || (u.role === 'Admin' && users.filter(usr => usr.role === 'Admin').length <= 1)) ? 0.4 : 1,
                                                    cursor: (u._id === localStorage.getItem('userId') || (u.role === 'Admin' && users.filter(usr => usr.role === 'Admin').length <= 1)) ? 'not-allowed' : 'pointer'
                                                }}
                                                disabled={u._id === localStorage.getItem('userId') || (u.role === 'Admin' && users.filter(usr => usr.role === 'Admin').length <= 1)}
                                                title={u._id === localStorage.getItem('userId') ? "You cannot delete your own account" : (u.role === 'Admin' && users.filter(usr => usr.role === 'Admin').length <= 1) ? "Cannot delete the only administrator" : "Delete User"}
                                                onMouseOver={(e) => {
                                                    if (!(u._id === localStorage.getItem('userId') || (u.role === 'Admin' && users.filter(usr => usr.role === 'Admin').length <= 1))) {
                                                        e.currentTarget.style.transform = 'scale(1.2)';
                                                    }
                                                }}
                                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
