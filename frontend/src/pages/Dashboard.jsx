import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { TrendingUp, TrendingDown, Wallet, ArrowRight, BarChart as BarChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>Failed to load data.</div>;

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const barData = Object.keys(data.categoryBreakdown).map(cat => ({
        name: cat,
        value: data.categoryBreakdown[cat]
    }));

    const trendData = data.monthlyTrends.map(item => ({
        name: item.month,
        income: item.income,
        expense: item.expense
    }));

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-2xl font-bold">Financial Overview</h1>
                <p className="text-muted">Welcome back! Here's a snapshot of your finances.</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card balance">
                    <div className="stat-header flex items-center gap-2">
                        <Wallet size={16} /> Total Balance
                    </div>
                    <div className="stat-value balance">
                        ₹{data.netBalance.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-muted">Net Worth</div>
                </div>
                
                <div className="stat-card income">
                    <div className="stat-header flex items-center gap-2">
                        <TrendingUp size={16} /> Total Income
                    </div>
                    <div className="stat-value income">
                        +₹{data.totalIncome.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-muted">Earnings</div>
                </div>
                
                <div className="stat-card expense">
                    <div className="stat-header flex items-center gap-2">
                        <TrendingDown size={16} /> Total Expenses
                    </div>
                    <div className="stat-value expense">
                        -₹{data.totalExpenses.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-muted">Spending</div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <h3 className="mb-6 font-bold">Financial Trends</h3>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h3 className="mb-6 font-bold">Expenses by Category</h3>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: '#f1f5f9' }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ gridColumn: 'span 1' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold">Recent Activity</h3>
                        <Link to="/records" className="text-sm font-bold flex items-center gap-1" style={{ color: 'var(--primary)' }}>
                            Full History <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th style={{ textAlign: 'right' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentTransactions.length === 0 ? (
                                    <tr><td colSpan="3" className="text-center text-muted">No transactions found</td></tr>
                                ) : data.recentTransactions.map(tx => (
                                    <tr key={tx._id}>
                                        <td>
                                            <div className="font-bold" style={{ fontSize: '0.95rem' }}>{tx.category}</div>
                                            <div className="text-sm text-muted">{tx.notes || 'Transaction'}</div>
                                        </td>
                                        <td className="text-sm text-muted">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <span className={`badge badge-${tx.type}`}>
                                                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
