import React from 'react'

const FooterComponent = () => {
    return (
        <div style={{ height: '4rem' }} className='footer w-100 text-light d-flex justify-content-center align-items-center'>
            Copywrite @ 2023. All rights reserved
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
