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
            toast(<NewMessage displayName={x.displayName} body={x.body} image={x.image} createdAt={x.createdAt} type={x.type} />);
        });
        clearNewMsgQueue();
    }, [clearNewMsgQueue, newMsgQueue]);

    return null;
});
