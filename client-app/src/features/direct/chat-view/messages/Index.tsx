import { observer } from "mobx-react-lite";
import React, {useState} from "react";
import { useStore } from "../../../../app/stores/store";
import Message from "./message/Index";
import ReplyIcon from '@mui/icons-material/Reply';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ForwardIcon from '@mui/icons-material/Forward';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";

export default observer(function Messages() {

    const [menuTop, setMenuTop] = useState(0);
    const [menuLeft, setMenuLeft] = useState(0);

    const onRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setMenuLeft(e.clientX);
        setMenuTop(e.clientY);
        handleClick(e);
    }

    const {directStore: {currentChat}, userStore: {user}} = useStore();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };

    if(!currentChat)
        return null;

    return (
        <>
            <div className="messages">
                {(currentChat?.type === 'privateChat' || currentChat?.type === 'localPrivate') && user && 
                
                currentChat.privateChat?.messages.map((message, i) => 
                <div className="messages__message">
                    <Message onRightClick={onRightClick} name="Name" isMe={user.username === message.username} showImg={false} imgSrc={'/assets/user.png'} text={message.body} key={i} />
                </div>)}
                <div className="messages__message">
                    <Message onRightClick={onRightClick} name="Name" isMe={false} showImg={true} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
                </div>
                <div className="messages__message">
                    <Message onRightClick={onRightClick} name="Name" isMe={false} showImg={false} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
                </div>
                <div className="messages__message">
                    <Message onRightClick={onRightClick} name="Name" isMe={true} showImg={false} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
                </div>

                <div className="messages__message">
                    <Message onRightClick={onRightClick} name="Name" isMe={false} showImg={true} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
                </div>
                <div className="messages__message">
                    <Message onRightClick={onRightClick} name="Name" isMe={false} showImg={false} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
                </div>
                <div className="messages__message">
                    <Message onRightClick={onRightClick} name="Name" isMe={true} showImg={false} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
                </div>

                <div className="messages__message">
                    <Message onRightClick={onRightClick} name="Name" isMe={false} showImg={true} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
                </div>
                <div className="messages__message">
                    <Message onRightClick={onRightClick} name="Name" isMe={false} showImg={false} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
                </div>
                <div className="messages__message">
                    <Message onRightClick={onRightClick} name="Name" isMe={true} showImg={false} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
                </div>

                <div className="messages__message">
                    <Message onRightClick={onRightClick} name="Name" isMe={false} showImg={true} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
                </div>
                <div className="messages__message">
                    <Message onRightClick={onRightClick} name="Name" isMe={false} showImg={false} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
                </div>
                <div className="messages__message">
                    <Message onRightClick={onRightClick} name="Name" isMe={true} showImg={false} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
                </div>
            </div>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                anchorReference="anchorPosition"
                anchorPosition={{ top: menuTop, left: menuLeft }}
            >
                <MenuItem onClick={handleClose} >
                <ListItemIcon>
                    <ReplyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Reply</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose} >
                <ListItemIcon>
                    <ContentCopyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose} >
                <ListItemIcon>
                    <ForwardIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Forward</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose} >
                <ListItemIcon>
                    <PushPinIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Pin</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose} >
                <ListItemIcon>
                    <DeleteOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
});