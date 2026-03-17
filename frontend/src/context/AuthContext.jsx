/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);

    const login = async (email, password) => {
        try {
            const { data } = await API.post('/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await API.post('/auth/register', { name, email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    const toggleFavorite = async (courseId) => {
        if (!user) return;
        try {
            const { data } = await API.post(`/courses/${courseId}/favorite`);
            const updatedUser = { ...user, favorites: data };
            setUser(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Error toggling favorite');
        }
    };

    const enrollInCourse = async (courseId) => {
        if (!user) return;
        try {
            await API.post(`/users/enroll/${courseId}`);
            // Re-fetch profile to get full enrolled courses list
            const profile = await API.get('/users/profile');
            const updatedUser = { ...user, ...profile.data };
            setUser(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Enrollment failed');
        }
    };

    const updateProgress = async (courseId, lessonIdx) => {
        if (!user) return;
        try {
            await API.post(`/users/progress/${courseId}`, { lessonIdx });
            const profile = await API.get('/users/profile');
            const updatedUser = { ...user, ...profile.data };
            setUser(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Progress update failed');
        }
    };

    const updateProfile = async (profileData) => {
        if (!user) return;
        try {
            const { data } = await API.put('/users/profile', profileData);
            const updatedUser = { ...user, ...data };
            setUser(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Profile update failed';
        }
    };

    return (
        <AuthContext.Provider value={{ user, token: user?.token, login, register, logout, toggleFavorite, enrollInCourse, updateProgress, updateProfile, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
