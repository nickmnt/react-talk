import { useState } from 'react';
import Dialog from '@mui/material/Dialog/Dialog';
import Paper from '@mui/material/Paper/Paper';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Slide from '@mui/material/Slide/Slide';
import { TransitionProps } from '@mui/material/transitions';
import IconButton from '@mui/material/IconButton/IconButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography/Typography';
import Stack from '@mui/material/Stack/Stack';
import Input from '@mui/material/Input/Input';
import { FileRecord } from './ChatInput';
import ReactPlayer from 'react-player';
import Button from '@mui/material/Button/Button';
import { useStore } from '../../../app/stores/store';

export interface Props {
    open: boolean;
    onClose: () => void;
    file: FileRecord | null;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default observer(function AttachmentDialog({ open, onClose, file }: Props) {
    const handleClose = () => {
        onClose();
    };

    const [value, setValue] = useState('');

    const {
        directStore: { createVideo, createPhoto, currentChat }
    } = useStore();

    if (!file || !currentChat) {
        return null;
    }

    const onSend = async () => {
        const tmp = file;
        const tmpVal = value;
        setValue('');
        onClose();

        if (tmp.video) {
            createVideo(tmp.file, tmpVal);
        } else {
            createPhoto(tmp.file, tmpVal);
        }
    };

    return (
        <Dialog onClose={handleClose} open={open} TransitionComponent={Transition}>
            <div className="attachmentsDialog">
                <AppBar position="relative" elevation={1} sx={{ backgroundColor: 'white', color: 'black' }}>
                    <Toolbar variant="dense">
                        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleClose}>
                            <CloseIcon fontSize="large" />
                        </IconButton>
                        <Typography variant="h6">Send Attachment</Typography>
                        <div style={{ flex: '1' }} />
                    </Toolbar>
                </AppBar>
                <Paper sx={{ minWidth: '30vw' }}>
                    <div style={{ padding: '1rem' }}>
                        <Stack>
                            <Input
                                placeholder="Caption"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                sx={{
                                    fontSize: '1.6rem',
                                    padding: 1.5,
                                    paddingLeft: 2.5,
                                    height: '4rem'
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button onClick={onSend}>Send</Button>
                            </div>
                            {file.video ? (
                                <ReactPlayer className="attachmentsDialog__player" controls={true} url={URL.createObjectURL(file.file)} />
                            ) : (
                                <img className="attachmentsDialog__image" alt="attachment" src={URL.createObjectURL(file.file)} />
                            )}
                        </Stack>
                    </div>
                </Paper>
            </div>
        </Dialog>
    );
});
