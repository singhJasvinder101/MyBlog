import React, { useRef, useState } from 'react';

const CustomSearchIcon = () => {
    const [isInputFocused, setInputFocused] = useState(false);
    const inputRef = useRef(null);

    const inputWrapperStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        position: 'relative',
    };

    const inputStyles = {
        borderStyle: 'none',
        height: '50px',
        width: isInputFocused ? '250px' : '50px', // Adjust width based on focus
        padding: '10px',
        outline: 'none',
        borderRadius: isInputFocused ? '0px' : '50%', // Adjust border radius based on focus
        transition: '.5s ease-in-out',
        backgroundColor: isInputFocused ? 'transparent' : '#212529', // Adjust background color based on focus
        boxShadow: '0px 0px 3px #f3f3f3',
        paddingRight: '40px',
        color: '#fff',
        fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
        fontSize: '17px',
    };

    const placeholderStyles = {
        color: '#8f8f8f',
    };

    const handleIconClick = () => {
        inputRef.current.focus();
    };

    const iconWrapperStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    };

    const iconStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: '0px',
        cursor: 'pointer',
        width: '50px',
        height: '50px',
        outline: 'none',
        borderStyle: 'none',
        borderRadius: '50%',
        pointerEvents: 'painted',
        backgroundColor: 'transparent',
        transition: '.2s linear',
    };

    const handleInputFocus = () => {
        setInputFocused(true);
    };

    const handleInputBlur = () => {
        setInputFocused(false);
    };

    return (
        <div style={inputWrapperStyles}>
            <button style={iconStyles} onClick={handleIconClick}>
                {/* Your SVG icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="25px" width="25px">
                    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" stroke="#fff" d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"></path>
                    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" stroke="#fff" d="M22 22L20 20"></path>
                </svg>
            </button>
            <input
                ref={inputRef}
                placeholder="search.."
                style={inputStyles}
                name="text"
                type="text"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
            />
        </div>
    );
};

export default CustomSearchIcon;

