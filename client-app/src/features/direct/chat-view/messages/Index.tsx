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
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [loadingNext, setLoadingNext] = useState(false);

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
            loadMessages
        },
        userStore: { user }
    } = useStore();

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
        forwardBody = forwardedMessages[0].displayName + ': ' + forwardedMessages[0].body;
    } else {
        if (forwardedSenderCount === 1) {
            forwardBody = `From  ${forwardedMessages[0].displayName}`;
        } else if (forwardedSenderCount === 2) {
            forwardBody = `From  ${forwardedMessages[0].displayName},${forwardedMessages[1].displayName}`;
        } else if (forwardedSenderCount !== 0) {
            forwardBody = `From  ${forwardedMessages[0].displayName} and ${(forwardedSenderCount - 1).toString()} others`;
        }
    }

    const truncate = (str: string, n: number) => {
        return str.length > n ? str.substring(0, n - 1) + '...' : str;
    };

    if (!currentChat || !user) return null;

    const onMoreUp = () => {
        if (!loadingNext && !!paginationMessages && paginationMessages.currentPage < paginationMessages.totalPages) {
            handleGetNext();
        }
    };

    // Message menu items enable booleans
    const canPin = currentChat.type !== 1 || currentChat.membershipType !== 0 || (currentChat.groupChat!.pinMessagesAll && currentChat.groupChat!.pinMessages);
    const canDelete =
        menuMsg &&
        (menuMsg.username === user.username || (currentChat.type === 1 && ((currentChat.membershipType === 1 && currentChat.groupChat!.deleteMessages) || currentChat.membershipType === 2)));
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
                            <Typography fontSize="1.4rem">{truncate(replyMessage.body, 30)}</Typography>
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
            <ChatScroller className="messages" onMoreUp={onMoreUp}>
                {user &&
                    currentChat.messages?.map((message, i) => (
                        <div className={`messages__message ${message.username === user.username && 'messages__message--me'}`} key={i} ref={(el) => (messagesRef.current[i] = el)}>
                            {message.type === 1000 ? (
                                <DateMessage message={message} />
                            ) : (
                                <MessageComponent onRightClick={(e) => onRightClick(e, message)} message={message} goToMessage={goToMessage} selected={selected} toggleSelected={toggleSelected} />
                            )}
                        </div>
                    ))}
            </ChatScroller>
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
                <MenuItem onClick={menuForward}>
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
                    <MenuItem onClick={() => setDeleteOpen(true)}>
                        <ListItemIcon>
                            <DeleteOutlineIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>
                )}
            </Menu>
            {menuMsg && <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} chatId={currentChat.id} messageId={menuMsg.id} />}
        </div>
    );
});
