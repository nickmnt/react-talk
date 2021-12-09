import { MoreVert } from "@mui/icons-material";
import Search from "@mui/icons-material/Search";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";

export default observer(function Header() {

    const {directStore: {currentChat, channelInfos}, chatStore: {addDetailsToStack}} = useStore();    
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
    
    if(!currentChat)
        return null;

    return (
        <div className="chatHeader">
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Search fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Search</ListItemText>
                </MenuItem>
            </Menu>
            {currentChat.type !== 2 || channelInfos.get(currentChat.id) ? (
            <>
            <div className="chatHeader__left" onClick={async () => await addDetailsToStack(currentChat)}>
                <div className="chatHeader__name">
                    {currentChat?.displayName}
                </div>
                <div className="chatHeader__status">
                    {currentChat.type === 2 ? `${channelInfos.get(currentChat.id)?.memberCount} ${channelInfos.get(currentChat.id)?.memberCount === 1 ? 'subscriber' : 'subscribers'}`  : "online"}
                </div>
            </div>
            <div className="chatHeader__right">
                <IconButton onClick={handleClick}>
                    <MoreVert />
                </IconButton>
            </div>
            </>
            ) : <LoadingComponent />}
        </div>
    );
});