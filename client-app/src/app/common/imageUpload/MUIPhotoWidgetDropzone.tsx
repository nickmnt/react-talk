import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import UploadIcon from '@mui/icons-material/Upload';
import Typography from '@mui/material/Typography/Typography';
import { PhotoType } from '../../models/chat';

interface Props {
    setFiles: (files: PhotoType[]) => void;
}

export default function MUIPhotoWidgetDropzone({ setFiles }: Props) {
    const dzStyles = {
        border: 'dashed 3px #eee',
        borderColor: '#eee',
        borderRadius: '5px',
        paddingTop: '30px',
        textAlign: 'center' as 'center',
        height: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column' as 'column'
    };

    const dzActive = {
        borderColor: 'green'
    };

    const onDrop = useCallback(
        (acceptedFiles) => {
            setFiles(
                acceptedFiles.map((file: any) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    })
                )
            );
        },
        [setFiles]
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}>
            <input {...getInputProps()} />
            <div>
                <UploadIcon />
                <Typography>Drop image here</Typography>
            </div>
        </div>
    );
}
