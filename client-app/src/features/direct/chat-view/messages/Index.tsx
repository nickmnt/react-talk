import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../../../../app/stores/store";
import MessageComponent from "./message-component/Index";
import ReplyIcon from "@mui/icons-material/Reply";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ForwardIcon from "@mui/icons-material/Forward";
import PushPinIcon from "@mui/icons-material/PushPin";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ScrollableFeed from "react-scrollable-feed";
import { SRLWrapper } from "simple-react-lightbox";
import Menu from "@mui/material/Menu/Menu";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon/ListItemIcon";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import Paper from "@mui/material/Paper/Paper";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton/IconButton";
import Stack from "@mui/material/Stack/Stack";
import Typography from "@mui/material/Typography/Typography";
import { Message } from "../../../../app/models/chat";

export default observer(function Messages() {
  const [menuTop, setMenuTop] = useState(0);
  const [menuLeft, setMenuLeft] = useState(0);
  const messagesRef = useRef<(HTMLElement | null)[]>([]);

  const {
    directStore: { currentChat, images, replyMessage, setReplyMessage, getMessageIndexById, clearReply },
    userStore: { user },
  } = useStore();

  const goToMessage = (id: number) => {
    const searchResult = getMessageIndexById(id);
    if(searchResult !== undefined) {
      console.log(searchResult)
      messagesRef.current[searchResult]?.scrollIntoView(({ behavior: 'smooth', block: 'nearest', inline: 'start' }));
    }
  }

  useEffect(() => {
    if(!currentChat)
      return;
    switch(currentChat.type) {
      case 0:
        messagesRef.current = messagesRef.current.slice(0, currentChat.privateChat?.messages.length);
        break;
      case 1:
        messagesRef.current = messagesRef.current.slice(0, currentChat.groupChat?.messages.length);
        break;
      case 2:
        messagesRef.current = messagesRef.current.slice(0, currentChat.channelChat?.messages.length);
        break;
    }
  }, [currentChat]);
 
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuMsg, setMenuMsg] = React.useState<null | Message>(null);
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

  if (!currentChat) return null;

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        overflowY: "auto",
        flexDirection: "column-reverse",
      }}
    >
      {replyMessage && (
        <Paper
          square
          sx={{
            height: "5.5rem",
            width: "100%",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <ReplyIcon
            className="mirror"
            style={{
              width: 30,
              height: 30,
              margin: "auto 0",
              marginLeft: "1rem",
              color: "#007FFF",
            }}
          />
          <div style={{ flex: 1 }}>
            <Stack
              direction="column"
              justifyContent="center"
              sx={{ marginLeft: "1.5rem", fontSize: "1rem", height: "100%" }}
            >
              <Typography
                fontSize="1.4rem"
                variant="h6"
                sx={{ color: "#007FFF" }}
              >
                {replyMessage.displayName}
              </Typography>
              <Typography fontSize="1.4rem">{replyMessage.body}</Typography>
            </Stack>
          </div>
          <IconButton style={{ width: 48, height: 48, margin: "auto 0" }} onClick={clearReply}>
            <CloseIcon />
          </IconButton>
        </Paper>
      )}
      <ScrollableFeed className="messages">
        {(currentChat?.type === 0 || currentChat?.type === -10) &&
          user &&
          currentChat.privateChat?.messages.map((message, i) => (
            <div
              className={`messages__message ${
                message.username === user.username && "messages__message--me"
              }`}
              key={i}
              ref={el => messagesRef.current[i] = el} 
            >
              <MessageComponent onRightClick={(e) => onRightClick(e, message)} message={message} goToMessage={goToMessage}/>
            </div>
          ))}
        {currentChat?.type === 1 &&
          user &&
          currentChat.groupChat?.messages.map((message, i) => (
            <div
              className={`messages__message ${
                message.username === user.username && "messages__message--me"
              }`}
              key={i}
              ref={el => messagesRef.current[i] = el} 
            >
              <MessageComponent onRightClick={(e) => onRightClick(e, message)} message={message} goToMessage={goToMessage}/>
            </div>
          ))}
        {currentChat?.type === 2 &&
          user &&
          currentChat.channelChat?.messages.map((message, i) => (
            <div
              className={`messages__message ${
                message.username === user.username && "messages__message--me"
              }`}
              key={i}
              ref={el => messagesRef.current[i] = el} 
            >
              <MessageComponent onRightClick={(e) => onRightClick(e, message)} message={message} goToMessage={goToMessage}/>
            </div>
          ))}
      </ScrollableFeed>
      <Paper
        square
        sx={{
          height: "5.5rem",
          width: "100%",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "row",
          zIndex: 1
        }}
        elevation={3}
      >
        <div style={{ flex: 1 }}>
          <Stack
            direction="column"
            justifyContent="center"
            sx={{ marginLeft: "1.5rem", fontSize: "1rem", height: "100%" }}
          >
            <Typography
              fontSize="1.4rem"
              variant="h6"
              sx={{ color: "#007FFF" }}
            >
              Pinned Message
            </Typography>
            <Typography fontSize="1.4rem">abcdABCDabcdABCDabcdABCD</Typography>
          </Stack>
        </div>
        <IconButton style={{ width: 48, height: 48, margin: "auto 0" }}>
          <CloseIcon />
        </IconButton>
      </Paper>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorReference="anchorPosition"
        anchorPosition={{ top: menuTop, left: menuLeft }}
      >
        <MenuItem onClick={() => setReplyMessage(menuMsg!)}>
          <ListItemIcon>
            <ReplyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reply</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ForwardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Forward</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PushPinIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Pin</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
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
