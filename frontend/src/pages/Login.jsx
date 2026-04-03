import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.displayMessage || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo flex items-center justify-center gap-2">
                        <LayoutDashboard size={40} />
                        <span>FinDash</span>
                    </div>
                    <h2>Welcome Back</h2>
                    <p className="text-muted">Enter your credentials to access your dashboard</p>
                </div>
                
                {error && <div className="mb-6 text-center text-sm" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '12px', fontWeight: '600' }}>{error}</div>}
                
                <form onSubmit={handleSubmit} className="flex flex-column gap-6">
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
                    <div className="flex flex-column gap-2">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                style={{ paddingRight: '3rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="bg-transparent"
                                style={{ 
                                    position: 'absolute', 
                                    right: '1rem', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)',
                                    padding: '0.25rem',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn-auth">Sign In</button>
                </form>
                
                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Create one now</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
