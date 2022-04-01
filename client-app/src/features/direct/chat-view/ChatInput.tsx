import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Paper from '@mui/material/Paper/Paper';
import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';
import IconButton from '@mui/material/IconButton/IconButton';
import Button from '@mui/material/Button/Button';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import Picker from 'emoji-picker-react';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import Menu from '@mui/material/Menu';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import { useStopwatch } from 'react-timer-hook';
import MicRecorder from 'mic-recorder-to-mp3';
import ChatTextInput from './ChatTextInput';
import AttachmentDialog from './AttachmentDialog';

const getFileExtension = (filename: string) => {
    return filename.split('.').pop();
};

export interface FileRecord {
    video: boolean;
    file: Blob;
}

export interface Props {
    selectedCount: number;
}

export default observer(function ChatInput({ selectedCount }: Props) {
    const {
        directStore: { currentChat, createMessage, setForwarding, forwardingSingle, forwardSingle, createVoice, file, setFile }
    } = useStore();
    const inputFile = useRef<null | HTMLInputElement>(null);
    const [recording, setRecording] = useState(false);
    const { seconds, minutes, hours, start, pause, reset } = useStopwatch({ autoStart: false });
    const [recorder, setRecorder] = useState<any>();

    const onAttachmentClick = () => {
        inputFile.current!.click();
    };

    const onAttachmentChange = () => {
        const f = inputFile.current!.files![0];

        if (f) {
            const extension = getFileExtension(f.name)?.toLowerCase();

            if (f.size >= 1024 * 1024 * 50) {
                toast.error('File size is greater than 50 MB.');
                return;
            }

            if (extension) {
                if (['jpeg', 'bmp', 'gif', 'jpg', 'png'].includes(extension)) {
                    setFile({ video: false, file: f });
                } else if (['flv', 'm3u8', 'mov', 'mkv', 'mp4', 'mpd', 'ogv', 'webm'].includes(extension)) {
                    setFile({ video: true, file: f });
                } else {
                    toast.error('Sorry we only support mainstream video and image types.');
                }
            } else {
                toast.error('Sorry we only support mainstream video and image types.');
            }
        }
    };
    const formRef = useRef<FormikProps<{ body: string }>>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    useEffect(() => {
        setRecorder(new MicRecorder({ bitRate: 128 }));
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    if (!currentChat) return <></>;

    const canWrite = currentChat.type !== 1 || currentChat.membershipType !== 0 || (currentChat.groupChat!.sendMessages && currentChat.groupChat!.sendMessagesAll);
    const canSendMedia = currentChat.type !== 1 || currentChat.membershipType !== 0 || (currentChat.groupChat!.sendMedia && currentChat.groupChat!.sendMedia);

    if (selectedCount > 0) {
        return (
            <Paper square className="chatInput" elevation={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button sx={{ color: '#363636', textTransform: 'none' }}>
                    <Stack direction="row" alignItems="center" sx={{ marginLeft: '1rem' }}>
                        <ShortcutIcon className="mirror" sx={{ marginRight: '1rem' }} />
                        <Typography variant="h6">Reply</Typography>
                    </Stack>
                </Button>
                <Button sx={{ color: '#363636', textTransform: 'none' }} onClick={() => setForwarding(true)}>
                    <Stack direction="row" alignItems="center" sx={{ marginRight: '1rem' }}>
                        <ShortcutIcon sx={{ marginRight: '1rem' }} />
                        <Typography variant="h6">Forward</Typography>
                    </Stack>
                </Button>
            </Paper>
        );
    }

    const isChannelSubscriber = currentChat.type === 2 && currentChat.membershipType === 0;

    if (isChannelSubscriber) {
        return (
            <Paper square className="chatInput" elevation={3}>
                <Button variant="text" sx={{ width: '100%', height: '100%' }}>
                    Mute
                </Button>
            </Paper>
        );
    }

    if (!canWrite) {
        return (
            <Paper square className="chatInput" elevation={3}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography>Writing messages is disabled in this group</Typography>
                </div>
            </Paper>
        );
    }

    const onEmojiClick = (event: any, emojiObject: any) => {
        if (formRef.current) {
            formRef.current.setValues({ body: formRef.current.values.body + emojiObject.emoji });
        }
    };

    const startRecording = () => {
        if (recorder) {
            recorder.start().then(() => {
                start();
                setRecording(true);
            });
        }
    };

    const stopRecording = () => {
        if (recorder) {
            recorder
                .stop()
                .getMp3()
                .then(([, blob]: any) => {
                    pause();
                    reset();
                    setRecording(false);
                    createVoice(blob);
                })
                .catch((e: any) => console.log(e));
        }
    };

    if (recording) {
        return (
            <Paper square className="chatInput" elevation={3}>
                <div className="chatInput__blink" />
                <div style={{ fontSize: '1.6rem', marginRight: 'auto', display: 'flex', alignItems: 'center' }}>
                    <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '600' }}>Recording...</div>
                <Button color="warning" sx={{ marginLeft: 'auto', width: '8rem', height: '8rem', marginRight: '-.5rem' }} variant="contained" onClick={stopRecording} className="chatInput__microphone">
                    <Typography variant="h5">STOP</Typography>
                </Button>
            </Paper>
        );
    }

    return (
        <Paper square className="chatInput" elevation={3}>
            <IconButton onClick={handleClick}>
                <SentimentSatisfiedAltIcon />
            </IconButton>
            <Formik
                innerRef={formRef}
                onSubmit={(values, { resetForm }) => {
                    if (!file) {
                        const tmp = values.body;
                        resetForm();
                        if (forwardingSingle) {
                            forwardSingle(tmp);
                        } else {
                            createMessage(tmp);
                        }
                    }
                }}
                initialValues={{ body: '' }}
                validationSchema={Yup.object({
                    body: Yup.string().required()
                })}
            >
                {({ isValid, handleSubmit }) => (
                    <Form className="chatInput__form">
                        <Field name="body">{(props: FieldProps) => <ChatTextInput props={props} isValid={isValid} handleSubmit={handleSubmit} />}</Field>
                    </Form>
                )}
            </Formik>

            <input type="file" ref={inputFile} style={{ display: 'none' }} onClick={(e) => (e.currentTarget.value = '')} onChange={onAttachmentChange} />
            {canSendMedia && (
                <IconButton onClick={onAttachmentClick}>
                    <AttachFileIcon />
                </IconButton>
            )}
            <IconButton
                onClick={() => {
                    startRecording();
                }}
            >
                <MicIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
            >
                <Picker onEmojiClick={onEmojiClick} />
            </Menu>
            <AttachmentDialog open={!!file} onClose={() => setFile(null)} file={file} />
        </Paper>
    );
});
