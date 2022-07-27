import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useStore } from '../../../app/stores/store';
import NewMessage from './NewMessage';

export default observer(function NotificationHandler() {
    const {
        directStore: { newMsgQueue, clearNewMsgQueue }
    } = useStore();

    useEffect(() => {
        if (newMsgQueue.length === 0) return;
        newMsgQueue.forEach((x) => {
            toast(<NewMessage displayName={x.message.displayName} body={x.message.body} image={x.message.image} createdAt={x.message.createdAt} type={x.message.type} chatId={x.chatId} />);
        });
        clearNewMsgQueue();
    }, [clearNewMsgQueue, newMsgQueue]);

    return null;
});
