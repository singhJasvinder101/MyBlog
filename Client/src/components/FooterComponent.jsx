import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

const FooterComponent = () => {
    const location = useLocation();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const shouldNotShowFooter = windowWidth <= 1068 && location.pathname.startsWith('/post-details/');

    if (shouldNotShowFooter) {
        return null;
    }
    
    return (
        <div style={{
            height: '5rem',
        }} className='footer w-100 text-light d-flex justify-content-center align-items-center'>
            Copywrite @ 2024. All rights reserved
            <span
                className='pb-1'
                style={{
                    position: 'absolute',
                    right: '2rem',
                    fontSize: '1.2rem',
                    fontFamily: "'Dancing Script', cursive",
                }}>
                Jasvinder Singh
            </span>
        </div>
    )
}

export default FooterComponent
