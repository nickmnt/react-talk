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
        directStore: { getMessageById },
        chatStore: { addProfileDetailsToStack }
    } = useStore();
    const replyTo = getMessageById(message.replyToId);

    return (
        <Zoom in={inViewport} timeout={250}>
            <Paper className={`text${isMe ? '--me' : '--other'}`} sx={{ backgroundColor: isMe ? '#f0ffde' : 'white', opacity: message.beingDeleted ? '0.5' : '1' }} square elevation={6}>
                {replyTo && (
                    <div style={{ width: '100%', height: '3.5rem', display: 'flex', margin: '.75rem 0', opacity: '.8', cursor: 'pointer' }} onClick={() => goToMessage(replyTo.id)}>
                        <div style={{ width: '.3rem', height: '100%', backgroundColor: '#007fff', marginRight: '1rem' }} />
                        <Stack direction="column" justifyContent="center" sx={{ fontSize: '1rem', height: '100%' }}>
                            <Typography fontSize="1.4rem" variant="h6" sx={{ color: '#007FFF' }}>
                                {replyTo.username}
                            </Typography>
                            <Typography fontSize="1.4rem">{truncate(replyTo.body, 30)}</Typography>
                        </Stack>
                    </div>
                )}
                {message.forwardUsername && (
                    <div style={{ height: '3.5rem', display: 'flex', margin: '.75rem 0', opacity: '.8', color: '#007FFF' }}>
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
                    <img onClick={() => console.log('open lightbox with image index')} src={isLocal ? URL.createObjectURL(localBlob!) : attachedImg} alt="Attachment" className="text__attachedImg" />
                )}
                {type === 2 && <ReactPlayer controls={true} url={isLocal ? URL.createObjectURL(localBlob!) : attachedVideo} />}
                <div className="text__container">
                    {!isMe && showImg && <div className="text__name">{name}</div>}
                    <p className="text__content">
                        {message.localProgress?.toString()}
                        {text}
                    </p>
                    <div className="text__info">
                        <div className={`text__date${isMe ? '--me' : '--other'}`}>{date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                        {isMe && (isLocal ? <AccessTimeIcon sx={{ color: '#57b84c' }} /> : isDoubleTick ? <DoubleTick /> : <Tick />)}
                    </div>
                </div>
            </Paper>
        </Zoom>
    );
});
