import { Avatar, Drawer, IconButton, InputBase, ListItem, ListItemIcon, ListItemText, Paper, SwipeableDrawer, CardContent, Card, Typography, Divider} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { useState } from 'react';
import { Box } from '@mui/system';
import List from '@mui/material/List';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import deepPurple from '@mui/material/colors/deepPurple';


interface Props {
    searchVal: string;
    setSearchVal: (val: string) => void;
}

const menuFontSize = 16;

const iOS =
  typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  

export default observer(function Actions({setSearchVal, searchVal}: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const {userStore: {user}} = useStore(); 

    const toggleDrawer = 
        (open: boolean) => 
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if(
                event && 
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' || 
                 (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }

            setDrawerOpen(open);
        }

    return (
        <div className="actions">
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
            <svg onClick={toggleDrawer(true)} className="actions__burgerIco" width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z"/></svg>
            <Paper
                component="form"
                sx={{p: '2x 4px', display:'flex', alignItems: 'center', width: 400}}
                className='actions__form actions__search'
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search"
                    inputProps={{ 'aria-label': 'search google maps' }}
                />
                <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>
        </div>
    );
});