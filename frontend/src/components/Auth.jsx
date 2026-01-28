import React, { useState } from 'react';
import { FiUser, FiLock, FiMail, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { login, register } from '../services/api';
import { toast } from 'react-toastify';

const Auth = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                const response = await login({
                    username: formData.username,
                    password: formData.password
                });
                toast.success(`Welcome back, ${response.data.fullName || response.data.username}!`);
                onLoginSuccess(response.data);
            } else {
                await register(formData);
                toast.success('Registration successful! Please login.');
                setIsLogin(true);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Authentication failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-overlay">
            <div className="auth-card">
                <div className="auth-logo">💰</div>

                <h1 className="auth-title">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="auth-subtitle">
                    {isLogin ? 'Enter your details to manage your money' : 'Join thousands of users managing their wealth'}
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <>
                            <div className="auth-input-group">
                                <label className="auth-label">Full Name</label>
                                <div className="auth-input-wrapper">
                                    <FiCheckCircle className="auth-input-icon" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        className="auth-input"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>
                            <div className="auth-input-group">
                                <label className="auth-label">Email Address</label>
                                <div className="auth-input-wrapper">
                                    <FiMail className="auth-input-icon" />
                                    <input
                                        type="email"
                                        name="email"
                                        className="auth-input"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="auth-input-group">
                        <label className="auth-label">Username</label>
                        <div className="auth-input-wrapper">
                            <FiUser className="auth-input-icon" />
                            <input
                                type="text"
                                name="username"
                                className="auth-input"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="Enter username"
                            />
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-label">Password</label>
                        <div className="auth-input-wrapper">
                            <FiLock className="auth-input-icon" />
                            <input
                                type="password"
                                name="password"
                                className="auth-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            padding: '1rem',
                            marginTop: '1rem',
                            fontSize: '1rem',
                            borderRadius: '14px'
                        }}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                        {!loading && <FiArrowRight style={{ marginLeft: '0.5rem' }} />}
                    </button>
                </form>

                <div className="auth-switch-text">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="auth-switch-btn"
                    >
                        {isLogin ? 'Create one' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
