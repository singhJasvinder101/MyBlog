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
        }} className='footer w-100 text-light d-flex-col justify-content-center align-items-center'>
            <div
                className='pb-1 mt-2 d-flex justify-content-center align-items-center'
                style={{
                    fontSize: '1.2rem',
                    fontFamily: "'Dancing Script', cursive",
                }}>
                Jasvinder Singh
            </div>
            <div className='d-flex justify-content-center align-items-center'>Copyright @ 2024. All rights reserved</div>

        </div>
    )
}

export default FooterComponent
