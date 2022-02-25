import Dialog from '@mui/material/Dialog/Dialog';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Typography from '@mui/material/Typography/Typography';
import Zoom from '@mui/material/Zoom/Zoom';
import { useStore } from '../../../app/stores/store';
import Button from '@mui/material/Button/Button';

export interface Props {
    open: boolean;
    chatId: string;
    messageId: number;
    onClose: () => void;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Zoom ref={ref} {...props} />;
});

export default observer(function DeleteDialog({ open, onClose, chatId, messageId }: Props) {
    const {
        directStore: { deleteMessage }
    } = useStore();

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open} TransitionComponent={Transition}>
            <div style={{ padding: '2rem' }}>
                <Typography sx={{ fontSize: '1.8rem' }}>Are you sure you want to delete this message?</Typography>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Button onClick={handleClose}>No</Button>
                    <Button
                        onClick={() => {
                            deleteMessage(chatId, messageId);
                            handleClose();
                        }}
                    >
                        Yes
                    </Button>
                </div>
            </div>
        </Dialog>
    );
});
