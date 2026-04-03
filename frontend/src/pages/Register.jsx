import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('Viewer');
    const [error, setError] = useState('');
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register({ name, email, password, role });
            navigate('/');
        } catch (err) {
            setError(err.displayMessage || 'Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header text-center">
                    <div className="auth-logo flex justify-center items-center gap-2">
                        <LayoutDashboard size={40} />
                        <span>FinDash</span>
                    </div>
                    <h2>Join FinDash</h2>
                    <p className="text-muted text-sm mt-2">Start your journey to financial freedom today</p>
                </div>
                
                {error && <div className="mb-6 text-center text-sm" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '12px', fontWeight: '600' }}>{error}</div>}
                
                <form onSubmit={handleSubmit} className="flex flex-column gap-5">
                    <div className="flex flex-column gap-2">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="mail@example.com"
                        />
                    </div>
                    <div className="grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="flex flex-column gap-2">
                            <label>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    style={{ paddingRight: '2.5rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="bg-transparent"
                                    style={{ 
                                        position: 'absolute', 
                                        right: '0.75rem', 
                                        top: '50%', 
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)',
                                        padding: '0.2rem',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-column gap-2">
                            <label>Initial Role</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="Viewer">Viewer</option>
                                <option value="Analyst">Analyst</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn-auth">Create Account</button>
                </form>
                
                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
