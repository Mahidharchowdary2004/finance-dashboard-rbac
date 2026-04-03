import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const FinancialRecordForm = ({ record, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    useEffect(() => {
        if (record) {
            setFormData({
                ...record,
                date: new Date(record.date).toISOString().split('T')[0],
            });
        }
    }, [record]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: Number(formData.amount)
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="flex justify-between items-center mb-6">
                    <h2>{record ? 'Edit Record' : 'Add New Record'}</h2>
                    <button onClick={onCancel} className="text-muted"><X /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-column gap-4">
                    <div className="flex-column gap-1">
                        <label className="text-sm font-bold">Amount</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ 
                                position: 'absolute', 
                                left: '1rem', 
                                top: '50%', 
                                transform: 'translateY(-50%)',
                                fontWeight: '700',
                                color: 'var(--text-muted)'
                            }}>₹</span>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                placeholder="0"
                                min="0.01"
                                step="0.01"
                                style={{ paddingLeft: '2.2rem' }}
                            />
                        </div>
                    </div>
                    
                    <div className="flex-column gap-1">
                        <label className="text-sm font-bold">Type</label>
                        <select name="type" value={formData.type} onChange={handleChange}>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                    
                    <div className="flex-column gap-1">
                        <label className="text-sm font-bold">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Food, Salary, Rent"
                        />
                    </div>
                    
                    <div className="flex-column gap-1">
                        <label className="text-sm font-bold">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="flex-column gap-1">
                        <label className="text-sm font-bold">Notes (Optional)</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add a note..."
                            rows="3"
                        />
                    </div>
                    
                    <button type="submit" className="btn-primary">
                        {record ? 'Update Record' : 'Save Record'}
                    </button>
                    <button type="button" onClick={onCancel} className="btn-secondary" style={{ background: 'var(--border)', color: 'var(--text)', border: 'none', padding: '0.75rem' }}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FinancialRecordForm;
