import React from 'react';
import { observer } from 'mobx-react-lite';
import Typography from '@mui/material/Typography/Typography';
import Stack from '@mui/material/Stack/Stack';
import { ErrorOutline } from '@mui/icons-material';
import Button from '@mui/material/Button/Button';
import { Link } from 'react-router-dom';

export default observer(function ServerError() {
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stack>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ErrorOutline color="error" />
                    <Typography sx={{ marginLeft: '1rem' }}>Oops - Something has gone wrong!</Typography>
                </div>
                <Link to="/direct/inbox">
                    <Button>Back to inbox</Button>
                </Link>
            </Stack>
        </div>
    );
});
