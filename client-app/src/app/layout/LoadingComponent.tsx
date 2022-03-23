import Paper from '@mui/material/Paper/Paper';
import React from 'react';
interface Props {
    inverted?: boolean;
    content?: string;
}

export default function LoadingComponent({ inverted = true, content = 'Loading...' }: Props) {
    return (
        <Paper square className="loader">
            <div className="spinner" />
            <div className="loader__content">{content}</div>
        </Paper>
    );
}
