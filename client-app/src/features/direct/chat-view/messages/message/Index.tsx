import Text from "./text/Index";

interface Props {
    isMe: boolean;
    imgSrc: string;
    text: string;
    name: string;
    showImg: boolean;
}

export default function Message({isMe, imgSrc, text, name, showImg}: Props) {
    return (
        <div className="message">
            {(!isMe && showImg) && <img src={imgSrc} alt="user" className="message__img" />}
            <Text name={name} isMe={isMe} text={text} isDoubleTick={true} showImg={showImg}/>
        </div>
    );
}