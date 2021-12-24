import ReactPlayer from 'react-player';
import DoubleTick from './DoubleTick';
import Tick from './Tick';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Message } from '../../../../../../app/models/chat';
import { useLightbox } from 'simple-react-lightbox';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../../../../app/stores/store';

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
}

export default observer(function Text({isMe,name,text,date,isDoubleTick,showImg,type,attachedImg, attachedVideo, isLocal, localBlob, message}: Props) {
    const { openLightbox } = useLightbox()

    const {directStore: {getImageIndex}} = useStore()

    return (
        <div className={`text${isMe ? "--me" : "--other"}`}>
            {type === 1 && <img onClick={() => openLightbox(getImageIndex(message.id))} src={isLocal ? URL.createObjectURL(localBlob!) : attachedImg} alt='Attachment' className='text__attachedImg' />}
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
        </div>
    );
})