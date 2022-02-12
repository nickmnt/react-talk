import { observer } from 'mobx-react-lite';
import ScrollableFeed from 'react-scrollable-feed';
import MessageSkeleton from './MessageSkeleton';

export default observer(function MessagesSkeleton() {
    return (
        <div
            style={{
                display: 'flex',
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                flexDirection: 'column-reverse'
            }}
        >
            <ScrollableFeed className="messages">
                {[false, false, true, false, false, true, true, false, false, false].map((isMe, i) => (
                    <div className={`messages__message ${isMe && 'messages__message--me'}`} key={i}>
                        <MessageSkeleton isMe={isMe} />
                    </div>
                ))}
            </ScrollableFeed>
        </div>
    );
});
