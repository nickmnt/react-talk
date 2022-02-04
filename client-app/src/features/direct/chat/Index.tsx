import { ChatDto } from '../../../app/models/chat';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import DoubleTick from '../chat-view/messages/message-component/text/DoubleTick';
import Paper from '@mui/material/Paper/Paper';
import Tick from '../chat-view/messages/message-component/text/Tick';
import DoneIcon from '@mui/icons-material/Done';
import { useState } from 'react';
import { useLongPress } from 'use-long-press';

interface Props {
    chat: ChatDto;
    forwarding?: boolean;
    selected?: ChatDto[];
    setSelected?: (chatDto: ChatDto[]) => void;
}

export default observer(function Chat({chat, forwarding, selected, setSelected}: Props) {
    
    const {directStore: {currentChat, getChatDetails, forwardToSingle}, userStore: {user}} = useStore(); 
    const [ready, setReady] = useState(true);
    
    const bind = useLongPress(() => {
        if(!selected || !setSelected)
        return;
        if(selected.length !== 0)
        return;
        setReady(false);
        setSelected([chat]);
        setTimeout(() => {
            setReady(true);
        }, 500);
    });   

    const clickedWhenForwarding = () => {
        if(!ready || !selected || !setSelected) 
            return;

        if(selected.length > 0) {
            const searchResult = selected?.find(x => x.id === chat.id);
            if(searchResult) {
                setSelected(selected?.filter(x => x.id !== chat.id));
            } else {
                setSelected([...selected, chat]);
            }    
        } else {
            forwardToSingle(chat);
        }
    }

    const isSelected = selected?.findIndex(x => x.id === chat.id) !== -1;

    return (
        <ListItemButton 
        className={`chat__container`} 
        selected={!forwarding && !!currentChat && currentChat.id===chat.id} 
        onClick={forwarding ? () => clickedWhenForwarding() : () => getChatDetails(chat)} 
        {...bind} >
            <ListItemAvatar sx={{position: 'relative', overflow: 'visible'}}>
                <Avatar
                  alt={chat.displayName}
                  src={chat.image}
                  sx={{width: 48, height: 48}}
                >
                </Avatar>
                {selected && selected.length > 0 && <div className={`chat__selectCircle ${isSelected && 'chat__selectCircle--selected'}`}>
                {isSelected && <DoneIcon sx={{width: '1.75rem', height: '1.75rem', color: 'white'}}/>}
                </div>}
            </ListItemAvatar>
            <div className="chat__right">
                <div className="chat__rightTop">
                    <div className="chat__name">{chat.displayName}</div>
                    
                    <div>
                    {chat.lastMessage?.username === user!.username && (
                        chat.lastMessageSeen ? 
                            <DoubleTick/>
                        :<Tick/>
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