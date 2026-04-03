import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.data);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    localStorage.removeItem('userId');
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const userData = response.data;
        localStorage.setItem('userId', userData._id);
        setUser(userData);
        return userData;
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        const userFields = response.data;
        localStorage.setItem('userId', userFields._id);
        setUser(userFields);
        return userFields;
    };

    const logout = () => {
        localStorage.removeItem('userId');
        setUser(null);
    };

    const isAdmin = user?.role === 'Admin';
    const isAnalyst = user?.role === 'Analyst' || user?.role === 'Admin';

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, isAdmin, isAnalyst }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
