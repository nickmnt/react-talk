import { SearchOutlined } from '@mui/icons-material';
import Button from '@mui/material/Button/Button';
import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stack>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <SearchOutlined />
                    <Typography sx={{ marginLeft: '1rem' }}>Oops - we've looked everywhere and could not find this</Typography>
                </div>
                <Link to="/direct/inbox">
                    <Button>Back to inbox</Button>
                </Link>
            </Stack>
        </div>
    );
}
