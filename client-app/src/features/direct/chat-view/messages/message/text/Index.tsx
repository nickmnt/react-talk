import ReactPlayer from 'react-player';
import DoubleTick from './DoubleTick';
import Tick from './Tick';

interface Props {
    isMe: boolean;
    name: string;
    text: string;
    isDoubleTick: boolean;
    showImg: boolean;
    attachedImg: string;
    attachedVideo: string;
}

export default function Text({isMe,name,text,isDoubleTick,showImg,attachedImg, attachedVideo}: Props) {
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
                    <div className={`text__date${isMe ? "--me" : "--other"}`}>6:14 PM</div>
                    {isMe && (isDoubleTick ? <DoubleTick /> : <Tick />)}
                </div>
            </div>
        </div>
    );
}