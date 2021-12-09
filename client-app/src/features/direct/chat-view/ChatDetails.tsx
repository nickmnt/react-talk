import { ArrowBack, MoreVert } from '@mui/icons-material'
import { Avatar, Button, IconButton, ListItem, ListItemButton, ListItemIcon, Paper, Stack, Tabs } from '@mui/material'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ChatIcon from '@mui/icons-material/Chat';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import { ChatPage } from '../../../app/models/chat';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

export interface Props {
    chatPage: ChatPage;
}

export default observer(function ChatDetails({chatPage}: Props) {
    const [value, setValue] = useState(0);
    const { chatStore: {removeFromStack} } = useStore();
    const {accountData} = chatPage;

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div style={{top: '0', left: '0', width: '100%', height: '100%', position: 'absolute', backgroundColor: 'blue', overflow: 'hidden'}}>
             <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <AppBar position="relative" elevation={1} sx={{backgroundColor: 'white', color:'black'}}>
                    <Toolbar variant="dense">
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => removeFromStack(chatPage)}
                    >
                        <ArrowBack fontSize="large" />
                    </IconButton>
                    <div style={{flexGrow: 1}}>
                    </div>
                    <IconButton sx={{}}>
                        <MoreVert />
                    </IconButton>
                    </Toolbar>
                    <Stack direction="row" spacing={2} sx={{width: '100%', marginTop: '2rem', marginBottom: '2rem', position: 'relative'}} alignItems="center" justifyContent="center">
                        <Avatar sx={{ width: 100, height: 100 }} alt="Okay" src="/broken-image.jpg"/>
                        <Typography variant="h3" sx={{color: '#333', fontWeight: '500'}}>
                            {accountData.displayName}
                        </Typography>
                        <Button variant="contained" sx={{borderRadius: '100%', width: '8rem', height: '8rem', position: 'absolute', bottom: '-6rem', right: 40}}>
                            <ChatIcon sx={{height: 40, width: 40}}></ChatIcon>
                        </Button>
                    </Stack>
                </AppBar>
                <Paper sx={{backgroundColor: "white", width: '100%', borderRadius: '0', flex: 1}} elevation={0}>
                    <Stack direction="row" spacing={2} sx={{width: '100%'}} alignItems="center" justifyContent="center">
                        <Stack direction="column" spacing={2} sx={{width: '60%', marginTop: '2rem'}} >
                        
                        <Typography variant="h5" sx={{color: '#0080FF', fontWeight: '500', marginTop: '1.5rem', marginLeft: '2rem'}}>
                            Info
                        </Typography>
                        {accountData.bio &&
                        <ListItem>
                            <ListItemButton component="a" href="#simple-list">
                                <ListItemIcon>
                                    <InfoOutlinedIcon sx={{width: 35, height: 35}}/>
                                </ListItemIcon>
                                <Stack direction="column" spacing={.25}>
                                    <Typography variant="h5" sx={{color: '#333', fontWeight: '500', marginTop: '1.5rem', marginLeft: 'rem'}}>
                                        {accountData.bio}
                                    </Typography>
                                    <Typography variant="h5" sx={{color: '#595959', fontWeight: '500', marginTop: '1.5rem', marginLeft: 'rem'}}>
                                        Bio
                                    </Typography>
                                </Stack>
                            </ListItemButton>
                        </ListItem>
                        }
                        <ListItem>
                            <ListItemButton component="a" href="#simple-list">
                                <ListItemIcon>
                                    <AlternateEmailIcon sx={{width: 35, height: 35}}/>
                                </ListItemIcon>
                                <Stack direction="column" spacing={.25}>
                                    <Typography variant="h5" sx={{color: '#333', fontWeight: '500', marginTop: '1.5rem', marginLeft: 'rem'}}>
                                        {accountData.username}
                                    </Typography>
                                    <Typography variant="h5" sx={{color: '#595959', fontWeight: '500', marginTop: '1.5rem', marginLeft: 'rem'}}>
                                        Username
                                    </Typography>
                                </Stack>
                            </ListItemButton>
                        </ListItem>
                        </Stack>
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{width: '100%'}} alignItems="center" justifyContent="center">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '60%' }}>
                        <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Media" sx={{fontSize: '1.4rem'}} />
                            <Tab label="Links" sx={{fontSize: '1.4rem'}} />
                            <Tab label="Voice" sx={{fontSize: '1.4rem'}} />
                            <Tab label="Groups" sx={{fontSize: '1.4rem'}} />
                        </Tabs>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </div>
    )
})