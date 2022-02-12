import { observer } from 'mobx-react-lite';
import HeaderSkeleton from './HeaderSkeleton';
import MessagesSkeleton from './MessagesSkeleton';
import ChatInputSkeleton from './ChatInputSkeleton';

export default observer(function ChatView() {
    return (
        <div className="chatView">
            <HeaderSkeleton />
            <MessagesSkeleton />
            <ChatInputSkeleton />
        </div>
    );
});
