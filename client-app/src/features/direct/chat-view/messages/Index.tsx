import { observer } from "mobx-react-lite";
import React, {useState} from "react";
import { useStore } from "../../../../app/stores/store";
import Message from "./message/Index";
import ReplyIcon from '@mui/icons-material/Reply';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ForwardIcon from '@mui/icons-material/Forward';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ScrollableFeed from 'react-scrollable-feed'
import { SRLWrapper } from "simple-react-lightbox";
import Menu from "@mui/material/Menu/Menu";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon/ListItemIcon";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import Paper from "@mui/material/Paper/Paper";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton/IconButton";
import Stack from "@mui/material/Stack/Stack";
import Typography from "@mui/material/Typography/Typography";

export default observer(function Messages() {

    const [menuTop, setMenuTop] = useState(0);
    const [menuLeft, setMenuLeft] = useState(0);

    const onRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setMenuLeft(e.clientX);
        setMenuTop(e.clientY);
        handleClick(e);
    }

    const {directStore: {currentChat, images}, userStore: {user}} = useStore();
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
        <div style={{display: 'flex', flex: 1, overflowY: 'auto', flexDirection: 'column-reverse'}}>
            <ScrollableFeed className="messages">
                {(currentChat?.type === 0 || currentChat?.type === -10) && user && 
                currentChat.privateChat?.messages.map((message, i) => 
                <div className={`messages__message ${message.username === user.username && 'messages__message--me'}`} key={i}>
                    <Message onRightClick={onRightClick} message={message} />
                </div>)}
                {(currentChat?.type === 1) && user && 
                currentChat.groupChat?.messages.map((message, i) => 
                <div className={`messages__message ${message.username === user.username && 'messages__message--me'}`} key={i}>
                    <Message onRightClick={onRightClick} message={message} />
                </div>)}
                {(currentChat?.type === 2) && user && 
                currentChat.channelChat?.messages.map((message, i) => 
                <div className={`messages__message ${message.username === user.username && 'messages__message--me'}`} key={i}>
                    <Message onRightClick={onRightClick} message={message} />
                </div>)}
            </ScrollableFeed>
            <Paper square sx={{height: '5.5rem', width: '100%', backgroundColor: 'white', display: 'flex', flexDirection: 'row'}}>
                <div style={{flex:1}}>
                    <Stack direction="column" justifyContent='center' sx={{marginLeft: '1.5rem', fontSize: '1rem', height: '100%'}}>
                        <Typography fontSize='1.4rem' variant='h6' sx={{color: '#007FFF'}}>
                            Pinned Message
                        </Typography>
                        <Typography fontSize='1.4rem'>
                            abcdABCDabcdABCDabcdABCD
                        </Typography>
                    </Stack>
                </div>
                <IconButton style={{width: 48, height: 48}}>
                    <CloseIcon />
                </IconButton>
            </Paper>
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
            <SRLWrapper elements={images} />
        </div>
    );
});