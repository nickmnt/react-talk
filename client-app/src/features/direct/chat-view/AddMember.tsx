import LoadingComponent from '../../../app/layout/LoadingComponent'
import { ChatPage } from '../../../app/models/chat'
import { ArrowBack, MoreVert } from '@mui/icons-material'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton/IconButton';
import Avatar from '@mui/material/Avatar/Avatar';
import Input from '@mui/material/Input/Input';
import Paper from '@mui/material/Paper/Paper';
import ListItem from '@mui/material/ListItem/ListItem';
import List from '@mui/material/List/List';
import ListItemButton from '@mui/material/ListItemButton/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import ListItemAvatar from '@mui/material/ListItemAvatar/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import { Profile } from '../../../app/models/profile';
import { useState } from 'react';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import { useStore } from '../../../app/stores/store';
import SpeedDial from '@mui/material/SpeedDial/SpeedDial';
import Done from '@mui/icons-material/Done';

export interface Props {
    chatPage: ChatPage;
}

export default function AddMember({chatPage}: Props) {
    const { chatStore: {removeFromStack}, directStore: {addMembers} } = useStore();
    const [members, setMembers] = useState<Profile[]>([]);

    if(!chatPage.followings || (!chatPage.groupData && !chatPage.channelData)) {
        return <LoadingComponent />
    }


    const toggleMember = (profile: Profile) => {
        if(members.find(x => x.username === profile.username)) {
            setMembers(members.filter(x => x.username !== profile.username));
        } else {
            setMembers([...members, profile]);
        }
    }

    const handleToggle = (profile: Profile) => () => {
        toggleMember(profile);
    };


    let curMembers: string[] = [];
    if(chatPage.groupData) {  
        curMembers = chatPage.groupData!.groupChat!.members.map(x => x.username);
    } else {
        curMembers = chatPage.channelData!.channelChat!.members.map(x => x.username);
    }

    const candidates = chatPage.followings.filter(x => !curMembers.includes(x.username));
    
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
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: '500', fontSize: '2rem' }}>
                        Add Members
                    </Typography>
                    <div style={{flexGrow: 1}}>
                    </div>
                    <IconButton sx={{}}>
                        <MoreVert />
                    </IconButton>
                    </Toolbar>
                </AppBar>
                <Paper sx={{backgroundColor: "white", width: '100%', borderRadius: '0'}} elevation={0}>
                    <Box sx={{width:'100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Input placeholder="Search for people..." sx={{ width: '100%', fontSize: '1.6rem', padding: 1.5, paddingLeft: 3.5 }} size="small"/>
                    </Box>
                </Paper >
                <Paper sx={{backgroundColor: "white", width: '100%', borderRadius: '0', flex: 1, display: 'flex'}} elevation={0}>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {candidates.map((profile) => {
                        const labelId = `checkbox-list-label-${profile.username}`;

                        return (
                        <ListItem
                            key={profile.username}
                            sx={{width:'100%', padding: '0 2rem'}}
                            disablePadding
                        >
                            <ListItemButton role={undefined} onClick={handleToggle(profile)} sx={{padding: '1.3rem'}} dense>
                            <ListItemIcon>
                                <Checkbox
                                edge="start"
                                checked={members.findIndex(x => x.username === profile.username) !== -1}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': labelId }}
                                sx={{transform: "scale(1.5)"}}
                                />
                            </ListItemIcon>
                            <ListItemAvatar>
                                <Avatar
                                alt={`${profile.displayName}`}
                                src={profile.image}
                                sx={{ width: 48, height: 48 }}
                                />
                            </ListItemAvatar>
                            <ListItemText id={labelId} primaryTypographyProps={{fontSize: '1.6rem'}}  primary={profile.displayName} />
                            </ListItemButton>
                        </ListItem>
                        );
                    })}
                    </List >
                </Paper >
            </Box>
            {members.length > 0 && <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<Done />}
                onClick={() => {
                    chatPage.groupData ? addMembers(chatPage.groupData, members) : chatPage.channelData && addMembers(chatPage.channelData, members)
                    removeFromStack(chatPage)
                }}
            />}
        </div>
    )
}
