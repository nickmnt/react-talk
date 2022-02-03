import { observer } from "mobx-react-lite";
import { Message } from "../../../../../app/models/chat";
import { useStore } from "../../../../../app/stores/store";
import Text from "./text/Index";
import {useEffect, useRef, useState} from 'react';
import useIntersection from "../../../../../app/models/useIntersection";
import { useLongPress } from "use-long-press";
import DoneIcon from '@mui/icons-material/Done';

interface Props {
    message: Message;
    onRightClick: (event: React.MouseEvent<HTMLDivElement>) => void;
    goToMessage: (id: number) => void;
    selected: Message[];
    toggleSelected: (messsage: Message) => void;
}

export default observer(function MessageComponent({message, onRightClick, goToMessage, selected, toggleSelected}: Props) {
    const [ready, setReady] = useState(true);
    // useEffect(() => {
    //     if (selected.length === 0) {
    //         setReady(false);
    //     }
    // }, [selected]);

    const bind = useLongPress(() => {
        setReady(false);
        if(selected.length === 0)
        toggleSelected(message);
        setTimeout(() => {
            setReady(true);
        }, 500);
    });    
    const ref = useRef<any>(null);
    const inViewport = useIntersection(ref, 1);
    const [doubleTick, setDoubleTick] = useState(false);

    const {userStore: {user}, directStore: {currentChat, updateLastSeen}} = useStore(); 
    

    useEffect(() => {
        if(!user)
            return;

        if(currentChat) {
            let seenDate = null;
            let any = false;
            switch(currentChat.type) {
                case 0:
                    seenDate = currentChat.privateChat!.myLastSeen;
                    if(message.createdAt <= seenDate) {
                        setDoubleTick(true);
                    }
                    break;
                case 1:
                    seenDate = currentChat.groupChat!.members!.forEach(x => {
                        if(x.username !== user.username && x.lastSeen >= message.createdAt) {
                            any = true;
                        }
                    });
                    if(any) {
                        setDoubleTick(true);
                    }
                    break;
                case 2:
                    seenDate = currentChat.channelChat!.members!.forEach(x => {
                        if(x.username !== user.username && x.lastSeen >= message.createdAt) {
                            any = true;
                        }
                    });
                    if(any) {
                        setDoubleTick(true);
                    }
                    break;
            }
        }
    }, [currentChat, message.createdAt, user, user?.username]);

    useEffect(() => {
        if(inViewport) {
            // console.log(`viewport!!! ${message.body}`)
            if(currentChat) {
                let seenDate = null;
    
                switch(currentChat.type) {
                    case 0:
                        seenDate = currentChat.privateChat!.myLastSeen;
                        if(message.createdAt > seenDate) {
                            updateLastSeen(message.createdAt);
                            // console.log(`update!!! ${message.body}`)
                        }
                        break;
                    case 1:
                        seenDate = currentChat.groupChat!.me!.lastSeen;
                        if(message.createdAt > seenDate) {
                            updateLastSeen(message.createdAt);
                            // console.log(`update!!! ${message.body}`)
                        }
                        break;
                    case 2:
                        seenDate = currentChat.channelChat!.me!.lastSeen;
                        if(message.createdAt > seenDate) {
                            updateLastSeen(message.createdAt);
                            // console.log(`update!!! ${message.body}`)
                        }
                        break;
                }
            }
        }
    }, [currentChat, inViewport, message.body, message.createdAt, updateLastSeen]);

    if(!user)
        return null;

    const isMe = user.username === message.username;
    const showImg = false;

    const isSelected = selected.find(x => x.id === message.id) !== undefined;

    return (
        <>
            <div className="message" onContextMenu={onRightClick} ref={ref} {...bind} onClick={() => selected.length > 0 && ready && toggleSelected(message)}>
                {selected.length > 0 && <div className={`message__selectCircle ${isSelected && 'message__selectCircle--selected'}`}>
                    {isSelected && <DoneIcon sx={{width: '1.75rem', height: '1.75rem', color: 'white'}}/>}
                </div>}
                <Text name={message.displayName} isMe={isMe} text={message.body} date={message.createdAt} isDoubleTick={doubleTick} showImg={showImg} attachedImg={message.type === 1? message.url : ''}
                    attachedVideo={message.type === 2? message.url: ''} isLocal={message.local} localBlob={message.localBlob} type={message.type} message={message}
                    goToMessage={goToMessage}/>
                {isSelected && <div className="message__mask"></div>}
            </div>   
        </>
    );
});