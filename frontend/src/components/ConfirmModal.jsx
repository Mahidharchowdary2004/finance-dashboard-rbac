import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, type = 'danger' }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '400px', padding: '2rem' }}>
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-full ${type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`} style={{ 
                        background: type === 'danger' ? '#fee2e2' : '#dbeafe', 
                        color: type === 'danger' ? '#ef4444' : '#3b82f6',
                        padding: '0.75rem',
                        borderRadius: '50%',
                        display: 'flex'
                    }}>
                        <AlertTriangle size={24} />
                    </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{title || 'Confirm Action'}</h3>
                <p className="text-muted mb-8">{message || 'Are you sure you want to proceed?'}</p>
                
                <div className="flex gap-4">
                    <button 
                        onClick={onCancel} 
                        className="flex-1 text-sm font-bold"
                        style={{ padding: '0.875rem', background: '#f1f5f9', color: '#64748b' }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="flex-1 text-sm font-bold"
                        style={{ 
                            padding: '0.875rem', 
                            background: type === 'danger' ? 'var(--danger)' : 'var(--primary)', 
                            color: 'white' 
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
