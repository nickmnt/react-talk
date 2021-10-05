import DoubleTick from './DoubleTick';
import Tick from './Tick';

interface Props {
    isMe: boolean;
    name: string;
    text: string;
    isDoubleTick: boolean;
    showImg: boolean;
}

export default function Text({isMe,name,text,isDoubleTick,showImg}: Props) {
    return (
        <div className={`text${isMe ? "--me" : "--other"}`}>
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