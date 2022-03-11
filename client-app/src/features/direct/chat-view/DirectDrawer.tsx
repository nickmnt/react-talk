import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import List from '@mui/material/List';
import { Box } from '@mui/system';
import React from 'react';
import deepPurple from '@mui/material/colors/deepPurple';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
// import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import SwipeableDrawer from '@mui/material/SwipeableDrawer/SwipeableDrawer';
import Card from '@mui/material/Card/Card';
import CardContent from '@mui/material/CardContent/CardContent';
import Avatar from '@mui/material/Avatar/Avatar';
import Typography from '@mui/material/Typography/Typography';
import ListItem from '@mui/material/ListItem/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import Divider from '@mui/material/Divider/Divider';

interface Props {
    drawerOpen: boolean;
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const menuFontSize = 16;
const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

export default observer(function DirectDrawer({ drawerOpen, toggleDrawer }: Props) {
    const {
        userStore: { user },
        groupStore: { startCreateGroup },
        directStore: { setSettingsOpen, setContactsOpen, setLocalSavedChat }
    } = useStore();

    const onCreateGroup = () => {
        startCreateGroup();
    };

    // const onCreateChannel = () => {
    // startCreateChannel();
    // };

    return (
        <SwipeableDrawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)} disableBackdropTransition={!iOS} disableDiscovery={iOS}>
            <svg width={0} height={0}>
                <linearGradient id="linearColors" x1={1} y1={0} x2={1} y2={1}>
                    <stop offset={0} stopColor="#20bf55" />
                    <stop offset={1} stopColor="#01baef" />
                </linearGradient>
            </svg>
            <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                <Card style={{ backgroundColor: '#419fd9' }} square>
                    <CardContent>
                        {user?.image ? (
                            <Avatar alt={user.username} src={user?.image} sx={{ width: 48, height: 48 }} />
                        ) : (
                            <Avatar sizes="100px" alt={user?.username} sx={{ bgcolor: deepPurple[500] }}>
                                {user?.displayName.charAt(0)}
                            </Avatar>
                        )}
                        <Typography sx={{ fontSize: 16, marginTop: '1.5rem' }} color="white" gutterBottom>
                            {user?.displayName}
                        </Typography>
                        <Typography sx={{ fontSize: 13 }} color="white" gutterBottom>
                            @{user?.username}
                        </Typography>
                    </CardContent>
                </Card>
                <List>
                    <ListItem button onClick={onCreateGroup}>
                        <ListItemIcon>
                            <GroupOutlinedIcon fontSize="large" sx={{ fill: 'url(#linearColors)' }} />
                        </ListItemIcon>
                        <ListItemText primary="New Group" primaryTypographyProps={{ fontSize: menuFontSize }} />
                    </ListItem>
                    {/* <ListItem button onClick={onCreateChannel}>
                        <ListItemIcon>
                            <CampaignOutlinedIcon fontSize="large" sx={{ fill: 'url(#linearColors)' }} />
                        </ListItemIcon>
                        <ListItemText primary="New Channel" primaryTypographyProps={{ fontSize: menuFontSize }} />
                    </ListItem> */}
                    <ListItem button onClick={() => setContactsOpen(true)}>
                        <ListItemIcon>
                            <PersonOutlinedIcon fontSize="large" sx={{ fill: 'url(#linearColors)' }} />
                        </ListItemIcon>
                        <ListItemText primary="Contacts" primaryTypographyProps={{ fontSize: menuFontSize }} />
                    </ListItem>
                    <ListItem button onClick={() => setLocalSavedChat()}>
                        <ListItemIcon>
                            <BookmarkBorderOutlinedIcon fontSize="large" sx={{ fill: 'url(#linearColors)' }} />
                        </ListItemIcon>
                        <ListItemText primary="Saved Messages" primaryTypographyProps={{ fontSize: menuFontSize }} />
                    </ListItem>
                    <ListItem button onClick={() => setSettingsOpen(true)}>
                        <ListItemIcon>
                            <SettingsOutlinedIcon fontSize="large" sx={{ fill: 'url(#linearColors)' }} />
                        </ListItemIcon>
                        <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: menuFontSize }} />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemIcon>
                            <PersonAddOutlinedIcon fontSize="large" />
                        </ListItemIcon>
                        <ListItemText primary="Invite Friends" primaryTypographyProps={{ fontSize: menuFontSize }} />
                    </ListItem>
                </List>
            </Box>
        </SwipeableDrawer>
    );
});
