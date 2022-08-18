import IconButton from '@mui/material/IconButton/IconButton';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format } from 'date-fns';
import Button from '@mui/material/Button/Button';
import HeaderSkeleton from './HeaderSkeleton';
import Paper from '@mui/material/Paper/Paper';

export default observer(function Header() {
    const {
        directStore: { currentChat, removeCurrentChat, connected },
        chatStore: { addDetailsToStack }
    } = useStore();

    if (!currentChat || !(currentChat.privateChat || currentChat.groupChat || currentChat.channelChat || currentChat.type === -20 || currentChat.type === 3)) return <HeaderSkeleton />;

    let typingMessage = 'is typing...';
    if (currentChat.type === 1 && currentChat.typists) {
        typingMessage = `${currentChat.typists[0].displayName} ${currentChat.typists.length > 1 ? `and ${(currentChat.typists.length - 1).toString()} others are typing...` : 'is typing...'}`;
    }

    return (
        <Paper square className="chatHeader">
            <div className="chatHeader__back">
                <IconButton onClick={removeCurrentChat}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
            <>
                <div className="chatHeader__left" onClick={async () => await addDetailsToStack(currentChat)}>
                    <div className="chatHeader__name">{currentChat.type === -20 || currentChat.type === 3 ? 'Saved Messages' : currentChat?.displayName}</div>
                    {connected === 'reconnecting' ? (
                        <div className="chatHeader__lastSeen">Disconnected. Reconnecting...</div>
                    ) : currentChat.type === 0 && !currentChat.isOnline ? (
                        <div className="chatHeader__lastSeen">Last seen at {format(currentChat.lastSeen, 'yyyy-MM-dd HH:mm')}</div>
                    ) : (
                        <div className="chatHeader__status">
                            {currentChat.type === 1 && !currentChat.typists && `${currentChat.groupChat?.memberCount} ${currentChat.groupChat?.memberCount === 1 ? 'member' : 'members'}`}
                            {currentChat.type === 1 && currentChat.typists && typingMessage}
                            {currentChat.type === 2 && `${currentChat.channelChat?.memberCount} ${currentChat.channelChat?.memberCount === 1 ? 'subscriber' : 'subscribers'}`}
                            {currentChat.type === 0 && currentChat.isOnline && !currentChat.typing && 'online'}
                            {currentChat.isOnline && currentChat.typing && typingMessage}
                            {currentChat.type === -10 && `Send your first message to ${currentChat.participantUsername!}!`}
                        </div>
                    )}
                </div>
                {currentChat.type !== -20 && currentChat.type !== 3 && (
                    <div className="chatHeader__right">
                        <Button variant="contained" onClick={async () => await addDetailsToStack(currentChat)}>
                            Details
                        </Button>
                    </div>
                )}
            </>
        </Paper>
    );
});
