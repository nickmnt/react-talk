import ReactPlayer from 'react-player';
import DoubleTick from './DoubleTick';
import Tick from './Tick';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface Props {
    isMe: boolean;
    name: string;
    text: string;
    date: Date;
    isDoubleTick: boolean;
    showImg: boolean;
    attachedImg: string;
    attachedVideo: string;
    isLocal: boolean;
}

export default function Text({isMe,name,text,date,isDoubleTick,showImg,attachedImg, attachedVideo, isLocal}: Props) {
    return (
        <div className={`text${isMe ? "--me" : "--other"}`}>
            {attachedImg&& <img src={attachedImg} alt='Attachment' className='text__attachedImg' />}
            {attachedVideo && <ReactPlayer url={attachedVideo} />}
            <div className="text__container">
                {(!isMe && showImg) && <div className="text__name">
                    {name}
                </div>}
                <p className="text__content">
                    {text}
                </p>
                <div className="text__info">
                    <div className={`text__date${isMe ? "--me" : "--other"}`}>{date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                    {isMe && (isLocal ? <AccessTimeIcon sx={{color: '#57b84c'}} /> : (isDoubleTick ? <DoubleTick /> : <Tick />))}
                </div>
            </div>
        </div>
    );
}