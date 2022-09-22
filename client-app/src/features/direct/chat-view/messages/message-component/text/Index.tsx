import ReactPlayer from 'react-player';
import DoubleTick from './DoubleTick';
import Tick from './Tick';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Message } from '../../../../../../app/models/chat';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../../../../app/stores/store';
import Paper from '@mui/material/Paper/Paper';
import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';
import { truncate } from '../../../../../../app/common/utility';
import Zoom from '@mui/material/Zoom/Zoom';
import { Image } from 'mui-image';
import { useEffect, useState } from 'react';
import { LinearProgress } from '@mui/material';

interface Props {
    isMe: boolean;
    name: string;
    text: string;
    date: Date;
    isDoubleTick: boolean;
    showImg: boolean;
    type: number;
    attachedImg: string;
    attachedVideo: string;
    isLocal: boolean;
    localBlob: Blob | undefined;
    message: Message;
    goToMessage: (id: number) => void;
    inViewport: boolean;
}

export default observer(function Text({ isMe, name, text, date, isDoubleTick, showImg, type, attachedImg, attachedVideo, isLocal, localBlob, message, goToMessage, inViewport }: Props) {
    const {
        directStore: { currentChat, getMessageById, openLightbox, mode, uploadMediaMessage },
        chatStore: { addProfileDetailsToStack }
    } = useStore();
    const replyTo = getMessageById(message.replyToId);

    const [uploadStarted, setUploadStarted] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        if (isLocal && !uploadStarted) {
            if (type === 1 || type === 2 || type === 3) {
                uploadMediaMessage(type, message.id, localBlob!, text, (progress: number) => {
                    setUploadProgress(progress);
                });
                setUploadStarted(true);
            }
        }
    }, [isLocal, localBlob, message.id, text, type, setUploadStarted, uploadStarted, uploadMediaMessage]);

    if (!currentChat) {
        return null;
    }

    let title = '';
    if (currentChat.groupChat) {
        const sender = currentChat.groupChat.members.find((x) => x.username === message.username);
        if (sender) {
            if (sender.customTitle) {
                title = sender.customTitle;
            } else {
                switch (sender.memberType) {
                    case 1:
                        title = 'Admin';
                        break;
                    case 2:
                        title = 'Owner';
                        break;
                }
            }
        }
    }

    return (
        <Zoom in={inViewport} timeout={500}>
            <Paper
                className={`text${isMe ? '--me' : '--other'}`}
                sx={{ backgroundColor: isMe ? (mode === 'light' ? 'primary.light' : 'primary.dark') : 'background.paper', opacity: message.beingDeleted ? '0.5' : '1', color: 'text.primary' }}
                square
                elevation={6}
            >
                {!isMe && (
                    <Stack direction="row" justifyContent="space-between">
                        <Typography fontSize="1.4rem" sx={{ color: 'primary.main', fontWeight: '500' }}>
                            {message.displayName}
                        </Typography>
                        {title && (
                            <Typography fontSize="1.4rem" sx={{ marginLeft: '1rem', color: 'text.secondary' }}>
                                {title}
                            </Typography>
                        )}
                    </Stack>
                )}
                {replyTo && (
                    <div style={{ width: '100%', height: '3.5rem', display: 'flex', margin: '.75rem 0', opacity: '.8', cursor: 'pointer' }} onClick={() => goToMessage(replyTo.id)}>
                        <Stack sx={{ backgroundColor: 'primary.dark', marginRight: '1rem', width: '.3rem' }}></Stack>
                        <Stack direction="column" justifyContent="center" sx={{ fontSize: '1rem', height: '100%' }}>
                            <Typography fontSize="1.4rem" variant="h6" sx={{ color: 'primary.dark' }}>
                                {replyTo.username}
                            </Typography>
                            <Typography fontSize="1.4rem">{truncate(replyTo.body, 30)}</Typography>
                        </Stack>
                    </div>
                )}
                {message.forwardUsername && (
                    <div style={{ height: '3.5rem', display: 'flex', margin: '.75rem 0', opacity: '.8', color: 'primary.dark' }}>
                        <Stack direction="column" justifyContent="center" sx={{ fontSize: '1rem', height: '100%' }}>
                            <Typography fontSize="1.4rem">Forwarded message</Typography>
                            <Typography fontSize="1.4rem">
                                From{' '}
                                <span onClick={() => addProfileDetailsToStack(message.forwardUsername)} style={{ fontWeight: 600, cursor: 'pointer' }}>
                                    {message.forwardUsername}
                                </span>
                            </Typography>
                        </Stack>
                    </div>
                )}
                {type === 1 && (
                    <Paper sx={{ overflow: 'hidden' }} onClick={() => openLightbox(message.id)}>
                        <Image src={isLocal ? URL.createObjectURL(localBlob!) : attachedImg} alt="Attachment" className="text__attachedImg" showLoading />
                    </Paper>
                )}
                {type === 2 && (
                    <Paper sx={{ overflow: 'hidden' }}>
                        <ReactPlayer controls={true} url={isLocal ? URL.createObjectURL(localBlob!) : attachedVideo} />
                    </Paper>
                )}
                {type === 3 && <audio src={isLocal ? URL.createObjectURL(localBlob!) : message.url} controls />}
                {isLocal && <LinearProgress variant="determinate" value={uploadProgress} sx={{ marginTop: '0.5rem' }} color="primary" />}
                {isLocal && <div style={{ margin: '0.5rem 0' }}>Uploading... {uploadProgress}%</div>}
                <div className="text__container">
                    {!isMe && showImg && <div className="text__name">{name}</div>}
                    <Typography className="text__content">
                        {message.localProgress?.toString()}
                        {text}
                    </Typography>
                    <div className="text__info">
                        <Typography className={`text__date${isMe ? '--me' : '--other'}`} sx={{ marginRight: isMe ? '.5rem' : '0', color: 'text.secondary' }}>
                            {date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                        </Typography>
                        {isMe && (isLocal ? <AccessTimeIcon sx={{ color: 'text.primary' }} /> : isDoubleTick ? <DoubleTick /> : <Tick />)}
                    </div>
                </div>
            </Paper>
        </Zoom>
    );
});
