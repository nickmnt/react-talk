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
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import BookmarksIcon from '@mui/icons-material/Bookmarks';

interface Props {
    chat: ChatDto;
    forwarding?: boolean;
    selected?: ChatDto[];
    setSelected?: (chatDto: ChatDto[]) => void;
}

export default observer(function Chat({ chat, forwarding, selected, setSelected }: Props) {
    const {
        directStore: { currentChat, getChatDetails, forwardToSingle },
        userStore: { user }
    } = useStore();
    const [ready, setReady] = useState(true);

    const bind = useLongPress(() => {
        if (!selected || !setSelected) return;
        if (selected.length !== 0) return;
        setReady(false);
        setSelected([chat]);
        setTimeout(() => {
            setReady(true);
        }, 500);
    });

    const clickedWhenForwarding = () => {
        if (!ready || !selected || !setSelected) return;

        if (selected.length > 0) {
            const searchResult = selected?.find((x) => x.id === chat.id);
            if (searchResult) {
                setSelected(selected?.filter((x) => x.id !== chat.id));
            } else {
                setSelected([...selected, chat]);
            }
        } else {
            forwardToSingle(chat);
        }
    };

    const isSelected = selected?.findIndex((x) => x.id === chat.id) !== -1;
    let lastMsgText = 'No message yet';
    if (chat.lastMessage && chat.lastMessage.body) {
        lastMsgText = chat.lastMessage.body;
    } else {
        switch (chat.lastMessage?.type) {
            case 1:
                lastMsgText = 'Photo';
                break;
            case 2:
                lastMsgText = 'Video';
                break;
            case 3:
                lastMsgText = 'Voice';
                break;
        }
    }

    const isTyping = !!chat.typing || !!chat.typists;
    let typingMessage = 'is typing...';
    if (chat.type === 1 && chat.typists) {
        typingMessage = `${chat.typists[0].displayName} ${chat.typists.length > 1 ? `and ${(chat.typists.length - 1).toString()} others are typing...` : 'is typing...'}`;
    }

    return (
        <ListItemButton
            className={`chat__container`}
            selected={!forwarding && !!currentChat && currentChat.id === chat.id}
            onClick={forwarding ? () => clickedWhenForwarding() : () => getChatDetails(chat)}
            {...bind}
        >
            <ListItemAvatar sx={{ position: 'relative', overflow: 'visible' }}>
                {chat.type === 3 ? (
                    <Avatar alt={chat.displayName} sx={{ width: 48, height: 48, backgroundColor: '#007FFF' }}>
                        <BookmarksIcon />
                    </Avatar>
                ) : (
                    <Avatar alt={chat.displayName} src={chat.image} sx={{ width: 48, height: 48 }} />
                )}
                {selected && selected.length > 0 && (
                    <div className={`chat__selectCircle ${isSelected && 'chat__selectCircle--selected'}`}>
                        {isSelected && <DoneIcon sx={{ width: '1.75rem', height: '1.75rem', color: 'white' }} />}
                    </div>
                )}
                {!(selected && selected.length > 0) && chat.isOnline && <div className="chat__selectCircle chat__selectCircle--selected" />}
            </ListItemAvatar>
            <div className="chat__right">
                <div className="chat__rightTop">
                    <div className="chat__name">{chat.type === 3 ? 'Saved Messages' : chat.displayName}</div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {chat.lastMessage?.username === user!.username && (chat.lastMessageSeen ? <DoubleTick /> : <Tick />)}
                        <div style={{ marginLeft: '.5rem', fontSize: '1.2rem', fontWeight: 500 }}>
                            {chat.lastMessage?.createdAt.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                        </div>
                    </div>
                </div>
                <div className="chat__rightBottom">
                    {!isTyping ? (
                        <div className="last-msg" style={{ display: 'flex', alignItems: 'center' }}>
                            {chat.lastMessage && chat.lastMessage.type === 1 && <ImageIcon sx={{ marginRight: '0.5rem' }} />}
                            {chat.lastMessage && chat.lastMessage.type === 2 && <VideoLibraryIcon sx={{ marginRight: '0.5rem' }} />}
                            {chat.lastMessage && chat.lastMessage.type === 3 && <KeyboardVoiceIcon sx={{ marginRight: '0.5rem' }} />}
                            {lastMsgText.substring(0, 15)}
                        </div>
                    ) : (
                        <div className="last-msg" style={{ display: 'flex', alignItems: 'center', color: '#0088CC' }}>
                            {typingMessage}
                        </div>
                    )}
                    {(!currentChat || currentChat.id !== chat.id) && chat.notSeenCount > 0 && (
                        <Paper sx={{ backgroundColor: '#0088CC', color: 'white' }} square className="chat__badge">
                            {chat.notSeenCount}
                        </Paper>
                    )}
                </div>
            </div>
        </ListItemButton>
    );
});
