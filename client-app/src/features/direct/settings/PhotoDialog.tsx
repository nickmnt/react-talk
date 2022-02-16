import { useState } from 'react';
import Dialog from '@mui/material/Dialog/Dialog';
import Paper from '@mui/material/Paper/Paper';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import React from 'react';
import Slide from '@mui/material/Slide/Slide';
import { TransitionProps } from '@mui/material/transitions';
import IconButton from '@mui/material/IconButton/IconButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MUIPhotoWidgetDropzone from '../../../app/common/imageUpload/MUIPhotoWidgetDropzone';
import PhotoWidgetCropper from '../../../app/common/imageUpload/PhotoWidgetCropper';
import { PhotoType } from '../../../app/models/chat';
import DoneIcon from '@mui/icons-material/Done';
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import Typography from '@mui/material/Typography/Typography';

export interface Props {
    open: boolean;
    onClose: () => void;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default observer(function PhotoDialog({ open, onClose }: Props) {
    const {
        photoStore: { uploadPhoto, uploading, step, setStep }
    } = useStore();

    const [files, setFiles] = useState<PhotoType[]>([]);
    const [cropper, setCropper] = useState<Cropper>();

    const handleClose = () => {
        onClose();
    };

    const onCrop = () => {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob((blob) => uploadPhoto(blob!));
            setStep(2);
        }
    };

    const handleFiles = (files: PhotoType[]) => {
        setFiles(files);
        if (files && files.length > 0) {
            setStep(1);
        }
    };

    const hasPrevious = step === 1;

    const previousStep = () => {
        if (hasPrevious) {
            setStep(step - 1);
        }
    };

    return (
        <Dialog onClose={handleClose} open={open} TransitionComponent={Transition}>
            <AppBar position="relative" elevation={1} sx={{ backgroundColor: 'white', color: 'black' }}>
                <Toolbar variant="dense">
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleClose}>
                        <CloseIcon fontSize="large" />
                    </IconButton>
                    {hasPrevious && (
                        <IconButton onClick={previousStep}>
                            <ArrowBackIcon />
                        </IconButton>
                    )}
                    <div style={{ flexGrow: 1 }} />
                    {step === 1 && (
                        <IconButton onClick={onCrop}>
                            <DoneIcon />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>
            <Paper sx={{ minWidth: '30rem' }}>
                <div style={{ padding: '1rem' }}>
                    {step === 0 && <MUIPhotoWidgetDropzone setFiles={handleFiles} />}
                    {step === 1 && <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />}
                    {uploading && (
                        <div style={{ width: '100%', height: '20rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <CircularProgress />
                            <Typography variant="h6" sx={{ marginTop: '1rem' }}>
                                Uploading Photo...
                            </Typography>
                        </div>
                    )}
                </div>
            </Paper>
        </Dialog>
    );
});
