
import { observer } from "mobx-react-lite";
import { Message } from "../../../../../app/models/chat";
import { useStore } from "../../../../../app/stores/store";
import Text from "./text/Index";

interface Props {
    message: Message;
    onRightClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default observer(function Message({message, onRightClick}: Props) {

    const {userStore: {user}} = useStore(); 
    if(!user)
        return null;

    const isMe = user.username === message.username;
    const showImg = false;
    const imgSrc='/assets/user.png';

    return (
        <>
            <div className="message" onContextMenu={onRightClick} >
                {(!isMe && showImg) && <img src={imgSrc} alt="user" className="message__img" />}
                <Text name={message.displayName} isMe={isMe} text={message.body} isDoubleTick={true} showImg={showImg} attachedImg={message.type === 1? message.url : ''}
                    attachedVideo={message.type === 2? message.url: ''}/>
            </div>   
        </>
    );
});