import Dialog from '@mui/material/Dialog/Dialog';
import React from 'react';
import ForwardSelection from './ForwardSelection';

export interface Props {
    open: boolean;
    onClose: () => void;
}

export default function ForwardDialog({ open, onClose }: Props) {
    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open} sx={{ minWidth: '50vw' }}>
            <ForwardSelection onClose={onClose} />
        </Dialog>
    );
}
