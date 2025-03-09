import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LandingPage } from '@/pages/landing';
import { LoginPage } from '@/pages/auth/login';
import { SignupPage } from '@/pages/auth/signup';
import { DashboardPage } from '@/pages/dashboard';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';

export function App() {
    const { init, isLoading, isAuthenticated } = useAuth();

    useEffect(() => {
        init();
    }, [init]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Navbar />
            <Sidebar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <LoginPage />} />
            </Routes>
        </Router>
    );
}