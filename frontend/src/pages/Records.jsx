import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Pencil, Trash, Filter, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FinancialRecordForm from '../components/FinancialRecordForm';
import ConfirmModal from '../components/ConfirmModal';

const Records = () => {
    const { user, isAdmin } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, recordId: null });
    
    // Filters State
    const [filters, setFilters] = useState({
        type: '',
        category: '',
        dateFrom: '',
        dateTo: '',
    });

    const fetchRecords = async () => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await api.get(`/records?${queryParams}`);
            setRecords(response.data);
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchRecords();
        }, 300);
        return () => clearTimeout(delaySearch);
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateUpdate = async (formData) => {
        try {
            if (editingRecord) {
                await api.put(`/records/${editingRecord._id}`, formData);
            } else {
                await api.post('/records', formData);
            }
            fetchRecords();
            setIsFormOpen(false);
            setEditingRecord(null);
        } catch (error) {
            alert(error.displayMessage || 'Action failed');
        }
    };

    const handleDelete = async () => {
        const id = deleteModal.recordId;
        try {
            await api.delete(`/records/${id}`);
            fetchRecords();
            setDeleteModal({ isOpen: false, recordId: null });
        } catch (error) {
            alert(error.displayMessage || 'Delete failed');
        }
    };

    const openEdit = (record) => {
        setEditingRecord(record);
        setIsFormOpen(true);
    };

    return (
        <div>
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Financial Records</h1>
                    <p className="text-muted">Manage your income and expenses.</p>
                </div>
                {isAdmin && (
                    <button onClick={() => { setEditingRecord(null); setIsFormOpen(true); }} className="btn-primary flex items-center gap-2" style={{ display: 'flex', width: 'auto' }}>
                        <Plus size={18} /> Add New Record
                    </button>
                )}
            </header>

            <div className="card mb-8">
                <div className="flex flex-column md:flex-row gap-4 items-center" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-muted" />
                        <span className="font-bold text-sm">Filters:</span>
                    </div>
                    <select name="type" value={filters.type} onChange={handleFilterChange} style={{ width: 'auto' }}>
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    <input
                        type="text"
                        name="category"
                        placeholder="Search category..."
                        value={filters.category}
                        onChange={handleFilterChange}
                        style={{ width: '220px' }}
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-muted">From:</span>
                        <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} style={{ width: 'auto' }} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-muted">To:</span>
                        <input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} style={{ width: 'auto' }} />
                    </div>
                    <button onClick={() => setFilters({ type: '', category: '', dateFrom: '', dateTo: '' })} className="text-sm text-primary font-bold bg-transparent" style={{ marginLeft: 'auto' }}>
                        Clear Filters
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: '0' }}>
                {loading ? <p style={{ padding: '2rem' }}>Loading records...</p> : (
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Notes</th>
                                    {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {records.length === 0 ? (
                                    <tr>
                                        <td colSpan={isAdmin ? 6 : 5} className="text-center" style={{ padding: '3rem' }}>
                                            <div className="text-muted">No records found matching your filters.</div>
                                        </td>
                                    </tr>
                                ) : records.map(record => (
                                    <tr key={record._id}>
                                        <td className="text-sm text-muted">{new Date(record.date).toLocaleDateString()}</td>
                                        <td><div className="font-bold">{record.category}</div></td>
                                        <td>
                                            <span className={`badge badge-${record.type}`}>
                                                {record.type}
                                            </span>
                                        </td>
                                        <td><div className="font-bold" style={{ fontSize: '1rem' }}>₹{record.amount.toLocaleString('en-IN')}</div></td>
                                        <td className="text-muted text-sm" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {record.notes || '-'}
                                        </td>
                                        {isAdmin && (
                                            <td style={{ textAlign: 'right' }}>
                                                <div className="flex gap-2 justify-end">
                                                    <button onClick={() => openEdit(record)} title="Edit" style={{ padding: '0.4rem', color: 'var(--text-muted)' }} className="bg-transparent">
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button onClick={() => setDeleteModal({ isOpen: true, recordId: record._id })} title="Delete" style={{ padding: '0.4rem', color: 'var(--danger)' }} className="bg-transparent">
                                                        <Trash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Delete Record?"
                message="Are you sure you want to delete this financial record? This action cannot be reversed."
                onConfirm={handleDelete}
                onCancel={() => setDeleteModal({ isOpen: false, recordId: null })}
            />

            {isFormOpen && (
                <FinancialRecordForm
                    record={editingRecord}
                    onSubmit={handleCreateUpdate}
                    onCancel={() => { setIsFormOpen(false); setEditingRecord(null); }}
                />
            )}
        </div>
    );
};

export default Records;
