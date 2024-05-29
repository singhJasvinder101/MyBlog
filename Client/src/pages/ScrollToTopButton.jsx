import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaArrowUp } from 'react-icons/fa'; 

const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        showButton && (
            <Button
                onClick={scrollToTop}
                className="position-fixed"
                style={{
                    bottom: '1rem',
                    right: '1rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '50%',
                    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            >
                <FaArrowUp />
            </Button>
        )
    );
};

export default ScrollToTopButton;
