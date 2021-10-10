import { Avatar, ListItem, ListItemIcon, ListItemText, SwipeableDrawer, CardContent, Card, Typography, Divider } from '@mui/material';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import List from '@mui/material/List';
import { Box } from '@mui/system'
import React from 'react'
import deepPurple from '@mui/material/colors/deepPurple';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';

interface Props {
    drawerOpen: boolean;
    toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const menuFontSize = 16;
const iOS =
  typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

export default observer(function DirectDrawer({drawerOpen, toggleDrawer}: Props) {
    const {userStore: {user}} = useStore(); 

    return (
        <SwipeableDrawer
                anchor='left'
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                disableBackdropTransition={!iOS} 
                disableDiscovery={iOS}
            >
                <Box
                    sx={{width: 250}}
                    role='presentation'
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <Card style={{backgroundColor: '#419fd9'}} square>
                        <CardContent>
                    {user?.image ? <Avatar alt={user.username} src={user?.image} sx={{ width: 48, height: 48 }} /> : 
                     <Avatar sizes='100px' alt={user?.username}  sx={{ bgcolor: deepPurple[500] }}>{user?.displayName.charAt(0)}</Avatar>}
                    <Typography sx={{ fontSize: 16, marginTop: '1.5rem' }} color="white" gutterBottom>
                    {user?.displayName}
                    </Typography>
                    <Typography sx={{ fontSize: 13 }} color="white" gutterBottom>
                        @{user?.username}
                    </Typography>
                    </CardContent>
                    </Card>
                    <List>
                        <ListItem button>
                            <ListItemIcon>
                                <GroupOutlinedIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary='New Group' primaryTypographyProps={{fontSize: menuFontSize}}/>
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon>
                                <PersonOutlinedIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary='Contacts' primaryTypographyProps={{fontSize: menuFontSize}} />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon>
                                <BookmarkBorderOutlinedIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary='Saved Messages' primaryTypographyProps={{fontSize: menuFontSize}} />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon>
                                <SettingsOutlinedIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary='Settings' primaryTypographyProps={{fontSize: menuFontSize}}/>
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <ListItemIcon>
                                <PersonAddOutlinedIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary='Invite Friends' primaryTypographyProps={{fontSize: menuFontSize}}/>
                        </ListItem>
                    </List>
                </Box>
            </SwipeableDrawer>
    )
});