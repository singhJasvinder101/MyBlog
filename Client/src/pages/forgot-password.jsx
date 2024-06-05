import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const apiUrl = import.meta.env.VITE_API_URI;
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/api/password/forgot-password`, { email });
            setMessage(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response.data.errorMessage);
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ForgotPassword;
