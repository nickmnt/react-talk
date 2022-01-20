import { ChatDto } from '../../../app/models/chat';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Done from '@mui/icons-material/Done';
import DoubleTick from '../chat-view/messages/message-component/text/DoubleTick';
import Paper from '@mui/material/Paper/Paper';

interface Props {
    chat: ChatDto;
}


export default observer(function Chat({chat}: Props) {

    const {directStore: {currentChat, getChatDetails}, userStore: {user}} = useStore(); 
    return (
        <ListItemButton className={`chat__container`} selected={!!currentChat && currentChat.id===chat.id} onClick={() => getChatDetails(chat)} >
            <ListItemAvatar>
                <Avatar
                  alt={chat.displayName}
                  src={chat.image}
                  sx={{width: 48, height: 48}}
                />
            </ListItemAvatar>
            <div className="chat__right">
                <div className="chat__rightTop">
                    <div className="chat__name">{chat.displayName}</div>
                    
                    <div>
                    {chat.lastMessage?.username === user!.username && (
                        chat.lastMessageSeen ? 
                            <DoubleTick></DoubleTick>
                        :<Done>

                        </Done>
                    )}
                    {chat.lastMessage?.createdAt.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                </div>
                <div className="chat__rightBottom">
                <div className="last-msg">
                    {chat.lastMessage ? chat.lastMessage.body.substring(0,15) : "No message yet"}
                </div>
                    {(!currentChat || currentChat.id !== chat.id) && chat.notSeenCount > 0 && <Paper sx={{backgroundColor: '#0088CC', color: 'white'}} square className="chat__badge">{chat.notSeenCount}</Paper>}
                </div>
            </div>
        </ListItemButton>
    );
});