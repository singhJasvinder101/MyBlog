import React from 'react'
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { FaCopy } from 'react-icons/fa'
import { FaNoteSticky } from 'react-icons/fa6'
import { BiSolidSearch } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom';
const SpeedDialComponent = ({ focusSearchInput }) => {
    const navigate = useNavigate()

    const handleCopyUrl = () => {
        const currentUrl = window.location.href;

        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                alert('URL copied to clipboard!');
            })
            .catch(err => {
                console.error('Error copying URL to clipboard:', err);
                alert('Failed to copy URL to clipboard. Please try again.');
            });
    };

    const handleCreateNewPost = () => {
        window.location.href = '/user/createPost';
    };


    const actions = [
        { name: 'Copy', icon: <FaCopy style={{ fontSize: '1.2rem' }} />, onclick: handleCopyUrl },
        { name: 'Create New Post', icon: <FaNoteSticky style={{ fontSize: '1.2rem' }} />, onclick: handleCreateNewPost },
        { name: 'Search', icon: <BiSolidSearch style={{ fontSize: '1.2rem' }} />, onclick: focusSearchInput },
    ];

    return (
        <div>
            <SpeedDial
                className='speed-dial'
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={action.onclick}
                    />
                ))}
            </SpeedDial>
        </div>
    )
}

export default SpeedDialComponent
