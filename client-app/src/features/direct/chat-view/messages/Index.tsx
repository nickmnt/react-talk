import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../../../app/stores/store';
import MessageComponent from './message-component/Index';
import ReplyIcon from '@mui/icons-material/Reply';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ForwardIcon from '@mui/icons-material/Forward';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Menu from '@mui/material/Menu/Menu';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import Paper from '@mui/material/Paper/Paper';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton/IconButton';
import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';
import { Message } from '../../../../app/models/chat';
import DateMessage from './DateMessage';
import { toast } from 'react-toastify';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteDialog from '../DeleteDialog';
import { PagingParams } from '../../../../app/models/pagination';
import ChatScroller from '../../../../app/common/utility/ChatScroller';
import { truncate } from '../../../../app/common/utility';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

export interface Props {
    selected: Message[];
    toggleSelected: (messsage: Message) => void;
    openPinOptions: () => void;
    openFoOptions: () => void;
}

export default observer(function Messages({ selected, toggleSelected, openPinOptions, openFoOptions }: Props) {
    const [menuTop, setMenuTop] = useState(0);
    const [menuLeft, setMenuLeft] = useState(0);
    const messagesRef = useRef<(HTMLElement | null)[]>([]);
    const [selectedPin, setSelectedPin] = useState(0);
    const [loadingNext, setLoadingNext] = useState(false);
    const [dragCount, setDragCount] = useState(0);

    const {
        directStore: {
            currentChat,
            replyMessage,
            setReplyMessage,
            getMessageIndexById,
            clearReply,
            getMessageById,
            removingPin,
            removePin,
            forwardingSingle,
            forwardedMessages,
            menuMsg,
            setMenuMsg,
            menuForward,
            clearForwardingSingle,
            paginationMessages,
            setPagingParamsMessages,
            loadMessages,
            canDelete,
            deleteMsgId,
            setDeleteMsgId,
            setFile
        },
        userStore: { user }
    } = useStore();

    const dzStyles = {
        border: 'dashed .5rem green',
        borderRadius: '1rem',
        height: 200
    };

    const handleGetNext = () => {
        if (!currentChat) {
            return;
        }
        setLoadingNext(true);
        setPagingParamsMessages(new PagingParams(paginationMessages!.currentPage + 1));
        loadMessages(currentChat.id).then(() => setLoadingNext(false));
    };

    const goToMessage = (id: number) => {
        const searchResult = getMessageIndexById(id);
        if (searchResult !== undefined) {
            messagesRef.current[searchResult]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
    };

    useEffect(() => {
        if (!currentChat) return;
        messagesRef.current = messagesRef.current.slice(0, currentChat.messages?.length);
    }, [currentChat]);

    useEffect(() => {
        if (!currentChat) return;
        setSelectedPin(currentChat.pins.length - 1);
    }, [currentChat, currentChat?.pins.length]);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const onRightClick = (e: React.MouseEvent<HTMLDivElement>, message: Message) => {
        e.preventDefault();
        setMenuLeft(e.clientX);
        setMenuTop(e.clientY);
        setMenuMsg(message);
        handleClick(e);
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onlyUnique = (value: any, index: any, self: any) => {
        return self.indexOf(value) === index;
    };

    const forwardedSenderCount = forwardedMessages.map((x) => x.username).filter(onlyUnique).length;
    let forwardBody = '';
    if (forwardedMessages.length === 1) {
        let msgType = '';
        switch (forwardedMessages[0].type) {
            case 1:
                msgType = 'Photo';
                break;
            case 2:
                msgType = 'Video';
                break;
            case 3:
                msgType = 'Voice';
                break;
        }
        forwardBody = `${forwardedMessages[0].displayName}: ${msgType ? msgType : forwardedMessages[0].body}`;
    } else {
        if (forwardedSenderCount === 1) {
            forwardBody = `From  ${forwardedMessages[0].displayName}`;
        } else if (forwardedSenderCount === 2) {
            forwardBody = `From  ${forwardedMessages[0].displayName},${forwardedMessages[1].displayName}`;
        } else if (forwardedSenderCount !== 0) {
            forwardBody = `From  ${forwardedMessages[0].displayName} and ${(forwardedSenderCount - 1).toString()} others`;
        }
    }

    if (!currentChat || !user) return null;

    const onMoreUp = () => {
        if (!loadingNext && !!paginationMessages && paginationMessages.currentPage < paginationMessages.totalPages) {
            handleGetNext();
        }
    };

    // Message menu items enable booleans
    const canPin = currentChat.type !== 1 || currentChat.membershipType !== 0 || (currentChat.groupChat!.pinMessagesAll && currentChat.groupChat!.pinMessages);

    let replyType = '';
    switch (replyMessage?.type) {
        case 1:
            replyType = 'Photo ';
            break;
        case 2:
            replyType = 'Video ';
            break;
        case 3:
            replyType = 'Voice ';
            break;
    }

    const msgBeingDeleted = currentChat.messages?.find((x) => x.id === deleteMsgId);

    const getFileExtension = (filename: string) => {
        return filename.split('.').pop();
    };

    const handleFiles = (files: FileList) => {
        if (files.length > 1) {
            toast('Drag only one file at a time.');
        } else {
            const f = files[0];
            if (f) {
                const extension = getFileExtension(f.name)?.toLowerCase();

                if (f.size >= 1024 * 1024 * 50) {
                    toast.error('File size is greater than 50 MB.');
                    return;
                }

                if (extension) {
                    if (['jpeg', 'bmp', 'gif', 'jpg', 'png'].includes(extension)) {
                        setFile({ video: false, file: f });
                    } else if (['flv', 'm3u8', 'mov', 'mkv', 'mp4', 'mpd', 'ogv', 'webm'].includes(extension)) {
                        setFile({ video: true, file: f });
                    } else {
                        toast.error('Sorry we only support mainstream video and image types.');
                    }
                } else {
                    toast.error('Sorry we only support mainstream video and image types.');
                }
            }
        }
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        setDragCount(0);
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    return (
        <div
            style={
                dragCount === 0
                    ? {
                          display: 'flex',
                          flex: 1,
                          overflowY: 'auto',
                          overflowX: 'hidden',
                          flexDirection: 'column-reverse'
                      }
                    : {
                          display: 'flex',
                          flex: 1,
                          overflowY: 'auto',
                          overflowX: 'hidden',
                          flexDirection: 'column-reverse',
                          ...dzStyles
                      }
            }
            onDrop={onDrop}
            onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            onDragEnter={(e) => {
                setDragCount(dragCount + 1);
                e.preventDefault();
                e.stopPropagation();
            }}
            onDragLeave={(e) => {
                setDragCount(dragCount - 1);
                e.preventDefault();
                e.stopPropagation();
            }}
            onDrag={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <input type="file" className="file-browser-input" name="file-browser-input" style={{ display: 'none' }} />
            {selected.length === 0 && replyMessage && (
                <Paper
                    square
                    sx={{
                        height: '5.5rem',
                        width: '100%',
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'row'
                    }}
                >
                    <ReplyIcon
                        className="mirror"
                        style={{
                            width: 30,
                            height: 30,
                            margin: 'auto 0',
                            marginLeft: '1rem',
                            color: '#007FFF'
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <Stack direction="column" justifyContent="center" sx={{ marginLeft: '1.5rem', fontSize: '1rem', height: '100%' }}>
                            <Typography fontSize="1.4rem" variant="h6" sx={{ color: '#007FFF' }}>
                                {replyMessage.displayName}
                            </Typography>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {replyMessage.type === 1 && <ImageIcon sx={{ marginRight: '0.5rem' }} />}
                                {replyMessage.type === 2 && <VideoLibraryIcon sx={{ marginRight: '0.5rem' }} />}
                                {replyMessage.type === 3 && <KeyboardVoiceIcon sx={{ marginRight: '0.5rem' }} />}
                                <Typography fontSize="1.4rem">{truncate(replyType + (replyMessage.body || ''), 30)}</Typography>
                            </div>
                        </Stack>
                    </div>
                    <IconButton style={{ width: 48, height: 48, margin: 'auto 0' }} onClick={clearReply}>
                        <CloseIcon />
                    </IconButton>
                </Paper>
            )}
            {selected.length === 0 && forwardingSingle && (
                <Paper
                    square
                    sx={{
                        height: '5.5rem',
                        width: '100%',
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'row',
                        cursor: 'pointer'
                    }}
                    onClick={openFoOptions}
                >
                    <ArrowForwardIcon
                        style={{
                            width: 30,
                            height: 30,
                            margin: 'auto 0',
                            marginLeft: '1rem',
                            color: '#007FFF'
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <Stack direction="column" justifyContent="center" sx={{ marginLeft: '1.5rem', fontSize: '1rem', height: '100%' }}>
                            <Typography fontSize="1.4rem" variant="h6" sx={{ color: '#007FFF' }}>
                                Forward {forwardedMessages.length === 1 ? 'message' : forwardedMessages.length + ' messages'}
                            </Typography>
                            <Typography fontSize="1.4rem">{truncate(forwardBody, 30)}</Typography>
                        </Stack>
                    </div>
                    <IconButton
                        style={{ width: 48, height: 48, margin: 'auto 0' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            clearForwardingSingle();
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Paper>
            )}
            {currentChat.messages && currentChat.messages.length > 0 ? (
                <ChatScroller className="messages" onMoreUp={onMoreUp}>
                    {user &&
                        currentChat.messages.map((message, i) => (
                            <div className={`messages__message ${message.username === user.username && 'messages__message--me'}`} key={i} ref={(el) => (messagesRef.current[i] = el)}>
                                {message.type === 1000 ? (
                                    <DateMessage message={message} />
                                ) : (
                                    <MessageComponent onRightClick={(e) => onRightClick(e, message)} message={message} goToMessage={goToMessage} selected={selected} toggleSelected={toggleSelected} />
                                )}
                            </div>
                        ))}
                </ChatScroller>
            ) : (
                <>
                    {currentChat.type === 3 || currentChat.type === -20 ? (
                        <div className="savedChatWelcome">
                            <div className="savedChatWelcome__container">
                                <div className="savedChatWelcome__icon">
                                    <CloudDownloadIcon className="savedChatWelcome__cloud" />
                                    Your cloud storage
                                </div>
                                <ul>
                                    <li>Forward messages here to save them</li>
                                    <li>Send media nad files to store them</li>
                                    <li>Access this chat from any device</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="savedChatWelcome">
                            <div className="savedChatWelcome__container">
                                <div className="savedChatWelcome__icon">
                                    <EmojiPeopleIcon className="savedChatWelcome__cloud" />
                                    No messages here yet...
                                </div>
                                <ul>
                                    <li>Send messages</li>
                                    <li>Send photos/videos</li>
                                    <li>Send voice messages</li>
                                    <li>Forward messages here</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </>
            )}
            {selected.length === 0 && currentChat.pins.length > 0 && selectedPin >= 0 && selectedPin < currentChat.pins.length && (
                <Paper
                    square
                    sx={{
                        height: '5.5rem',
                        width: '100%',
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'row',
                        zIndex: 1
                    }}
                    elevation={3}
                >
                    <div style={{ flex: 1 }}>
                        <Stack
                            direction="column"
                            justifyContent="center"
                            sx={{ marginLeft: '1.5rem', fontSize: '1rem', height: '100%', cursor: 'pointer' }}
                            onClick={() => {
                                let newIndex = selectedPin - 1;
                                if (newIndex === -1) {
                                    newIndex = currentChat.pins.length - 1;
                                }
                                goToMessage(currentChat.pins[selectedPin].messageId);
                                setSelectedPin(newIndex);
                            }}
                        >
                            <Typography fontSize="1.4rem" variant="h6" sx={{ color: '#007FFF' }}>
                                Pinned Message {selectedPin !== currentChat.pins.length - 1 && '#' + (selectedPin + 1).toString()}
                            </Typography>
                            <Typography fontSize="1.4rem">{getMessageById(currentChat.pins[selectedPin].messageId)?.body}</Typography>
                        </Stack>
                    </div>
                    <IconButton
                        style={{ width: 48, height: 48, margin: 'auto 0' }}
                        onClick={() => !removingPin && removePin(currentChat.id, currentChat.pins[selectedPin].id)}
                        sx={{ opacity: removingPin ? 0.25 : 1 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Paper>
            )}
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button'
                }}
                anchorReference="anchorPosition"
                anchorPosition={{ top: menuTop, left: menuLeft }}
            >
                <MenuItem
                    onClick={() => {
                        clearForwardingSingle();
                        setReplyMessage(menuMsg!);
                    }}
                >
                    <ListItemIcon>
                        <ReplyIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Reply</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        navigator.clipboard.writeText(menuMsg!.body);
                        toast('Copied text to clipboard', { type: 'success' });
                    }}
                >
                    <ListItemIcon>
                        <ContentCopyIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => menuForward(menuMsg!.id)}>
                    <ListItemIcon>
                        <ForwardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Forward</ListItemText>
                </MenuItem>
                {canPin && (
                    <MenuItem onClick={openPinOptions}>
                        <ListItemIcon>
                            <PushPinIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Pin</ListItemText>
                    </MenuItem>
                )}
                {canDelete && (
                    <MenuItem onClick={() => setDeleteMsgId(menuMsg!.id)}>
                        <ListItemIcon>
                            <DeleteOutlineIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>
                )}
            </Menu>
            {msgBeingDeleted && <DeleteDialog open={deleteMsgId !== -1} onClose={() => setDeleteMsgId(-1)} chatId={currentChat.id} messageId={deleteMsgId} />}
        </div>
    );
});
