import { ChatDto } from '../../../app/models/chat';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';

interface Props {
    chat: ChatDto;
}

export default observer(function Chat({chat}: Props) {

    const {directStore: {currentChat, getPrivateChatDetails}} = useStore(); 

    return (
        <div className="chat">
            <div className={`chat__container ${currentChat && currentChat.id===chat.id && "chat__container--active"}`} onClick={() => getPrivateChatDetails(chat)}>
                <div className="chat__left">
                    <img src="/assets/user.png" alt="User" className="chat__img" />
                </div>
                <div className="chat__right">
                    <div className="chat__rightTop">
                        <div className="chat__name">{chat.displayName}</div>
                        <div className={`chat__date ${currentChat && currentChat.id===chat.id && "chat__date--active"}`}>10:20 PM</div>
                    </div>
                    <div className="chat__rightBottom">
                    <div className="last-msg">
                        {"Random last message / status change of group channel and so on .................................".substring(0,15)}
                    </div>
                        {currentChat && currentChat.id !== chat.id && <div className="chat__badge">1696</div>}
                    </div>
                </div>
            </div>
        </div>
    );
});