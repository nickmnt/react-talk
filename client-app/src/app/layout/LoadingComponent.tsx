import Paper from '@mui/material/Paper/Paper';
import Typography from '@mui/material/Typography/Typography';
import React from 'react';
interface Props {
    inverted?: boolean;
    content?: string;
}

export default function LoadingComponent({ inverted = true, content = 'Loading...' }: Props) {
    return (
        <Paper square className="loader">
            <div className="spinner" />
            <Typography variant="h4" className="loader__content">
                {content}
            </Typography>
        </Paper>
    );
}
