import { IconButton, TextareaAutosize } from '@mui/material';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import * as Yup from 'yup';
import { ChangeEvent, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Paper from '@mui/material/Paper/Paper';
import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';
import Button from '@mui/material/Button/Button';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import Picker from 'emoji-picker-react';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import Menu from '@mui/material/Menu';

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
        directStore: { currentChat, createPrivateChat, createMessage, createPhoto, createVideo, setForwarding, forwardingSingle, forwardSingle }
    } = useStore();
    const inputFile = useRef<null | HTMLInputElement>(null);
    const [file, setFile] = useState<null | FileRecord>(null);

    const onAttachmentClick = () => {
        inputFile.current!.click();
    };

    const onAttachmentChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log('attachment changed');
        const f = inputFile.current!.files![0];

        if (f) {
            const extension = getFileExtension(f.name);

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

    return (
        <Paper square className="chatInput" elevation={3}>
            <IconButton onClick={handleClick}>
                <SentimentSatisfiedAltIcon />
            </IconButton>
            <Formik
                innerRef={formRef}
                onSubmit={(values, { resetForm }) => {
                    if (!currentChat.id) {
                        createPrivateChat(currentChat.privateChat!.otherUsername, values.body, file).then(() => {
                            resetForm();
                            setFile(null);
                        });
                    } else {
                        if (!file) {
                            if (forwardingSingle) {
                                forwardSingle(values.body).then(() => resetForm());
                            } else {
                                createMessage(values.body).then(() => resetForm());
                            }
                        } else {
                            if (file.video) {
                                createVideo(file.file, values.body).then(() => {
                                    resetForm();
                                    setFile(null);
                                });
                            } else {
                                createPhoto(file.file, values.body).then(() => {
                                    resetForm();
                                    setFile(null);
                                });
                            }
                        }
                    }
                }}
                initialValues={{ body: '' }}
                validationSchema={Yup.object({
                    body: Yup.string().required()
                })}
            >
                {({ isSubmitting, isValid, handleSubmit }) => (
                    <Form className="chatInput__form">
                        <Field name="body">
                            {(props: FieldProps) => (
                                <TextareaAutosize
                                    maxRows={2}
                                    className="chatInput__input"
                                    placeholder="Message"
                                    {...props.field}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && e.shiftKey) {
                                            return;
                                        }
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            isValid && handleSubmit();
                                        }
                                    }}
                                />
                            )}
                        </Field>
                    </Form>
                )}
            </Formik>

            <input type="file" ref={inputFile} style={{ display: 'none' }} onChange={onAttachmentChange} />
            {canSendMedia && (
                <svg onClick={onAttachmentClick} className="chatInput__attachment" width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1596 1385q0 117-79 196t-196 79q-135 0-235-100l-777-776q-113-115-113-271 0-159 110-270t269-111q158 0 273 113l605 606q10 10 10 22 0 16-30.5 46.5t-46.5 30.5q-13 0-23-10l-606-607q-79-77-181-77-106 0-179 75t-73 181q0 105 76 181l776 777q63 63 145 63 64 0 106-42t42-106q0-82-63-145l-581-581q-26-24-60-24-29 0-48 19t-19 48q0 32 25 59l410 410q10 10 10 22 0 16-31 47t-47 31q-12 0-22-10l-410-410q-63-61-63-149 0-82 57-139t139-57q88 0 149 63l581 581q100 98 100 235z" />
                </svg>
            )}
            <svg className="chatInput__microphone" width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                <path d="M1472 704v128q0 221-147.5 384.5t-364.5 187.5v132h256q26 0 45 19t19 45-19 45-45 19h-640q-26 0-45-19t-19-45 19-45 45-19h256v-132q-217-24-364.5-187.5t-147.5-384.5v-128q0-26 19-45t45-19 45 19 19 45v128q0 185 131.5 316.5t316.5 131.5 316.5-131.5 131.5-316.5v-128q0-26 19-45t45-19 45 19 19 45zm-256-384v512q0 132-94 226t-226 94-226-94-94-226v-512q0-132 94-226t226-94 226 94 94 226z" />
            </svg>
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
        </Paper>
    );
});
