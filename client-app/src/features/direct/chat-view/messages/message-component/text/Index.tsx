import ReactPlayer from 'react-player';
import DoubleTick from './DoubleTick';
import Tick from './Tick';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Message } from '../../../../../../app/models/chat';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../../../../app/stores/store';
import Paper from '@mui/material/Paper/Paper';
import Stack from "@mui/material/Stack/Stack";
import Typography from "@mui/material/Typography/Typography";

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
}

export default observer(function Text({isMe,name,text,date,isDoubleTick,showImg,type,attachedImg, attachedVideo, isLocal, localBlob, message, goToMessage}: Props) {
    const {directStore: {getMessageById}} = useStore()
    const replyTo = getMessageById(message.replyToId);

    return (
        <Paper className={`text${isMe ? "--me" : "--other"}`} square elevation={6}>
            {replyTo && 
            <div style={{width: '100%', marginLeft: '1rem', height: '3.5rem', display: 'flex', marginTop: '1rem', opacity: '.8', cursor: 'pointer'}}
                onClick={() => goToMessage(replyTo.id)}>
                <div style={{width: '.3rem', height: '100%', backgroundColor: '#007fff'}} />
                <Stack
                    direction="column"
                    justifyContent="center"
                    sx={{ margin: "0 1.5rem", fontSize: "1rem", height: "100%" }}
                >
                    <Typography
                        fontSize="1.4rem"
                        variant="h6"
                        sx={{ color: "#007FFF" }}
                    >
                    {replyTo.username}
                    </Typography>
                    <Typography fontSize="1.4rem">{replyTo.body}</Typography>
                </Stack>
            </div>}
            {type === 1 && <img onClick={() => console.log('open lightbox with image index')} src={isLocal ? URL.createObjectURL(localBlob!) : attachedImg} alt='Attachment' className='text__attachedImg' />}
            {type === 2 && <ReactPlayer controls={true} url={isLocal ?  URL.createObjectURL(localBlob!) : attachedVideo} />}
            <div className="text__container">
                {(!isMe && showImg) && <div className="text__name">
                    {name}
                </div>}
                <p className="text__content">
                    {message.localProgress?.toString()}
                    {text}
                </p>
                <div className="text__info">
                    <div className={`text__date${isMe ? "--me" : "--other"}`}>{date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                    {isMe && (isLocal ? <AccessTimeIcon sx={{color: '#57b84c'}} /> : (isDoubleTick ? <DoubleTick /> : <Tick />))}
                </div>
            </div>
        </Paper>
    );
})