import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const NotFoundPage = () => {
    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="text-center p-5 shadow-lg rounded" style={{ maxWidth: '600px', backgroundColor: '#fff' }}>
                <div className="display-1 fw-bold text-danger">404</div>
                <div className="h4 text-secondary mb-4">Oops! The page you are looking for does not exist.</div>
                <p className="lead text-muted mb-4">It looks like you might have taken a wrong turn. Don't worry, it happens to the best of us. Let's get you back on track.</p>
                <a href="/" className="btn btn-outline-primary btn-lg">Go Back Home</a>
            </div>
        </div>
    );
};

export default NotFoundPage;
