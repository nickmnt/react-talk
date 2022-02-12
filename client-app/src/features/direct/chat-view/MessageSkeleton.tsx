import { observer } from 'mobx-react-lite';
import TextSkeleton from './TextSkeleton';

export interface Props {
    isMe: boolean;
}

export default observer(function MessageComponent({ isMe }: Props) {
    return (
        <>
            <div className="message">
                <TextSkeleton isMe={isMe} />
            </div>
        </>
    );
});
