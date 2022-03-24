import { ArrowBack, Done } from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from 'react';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { observer } from 'mobx-react-lite';
import { Profile } from '../../../app/models/profile';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from '@mui/material/IconButton/IconButton';
import Input from '@mui/material/Input/Input';
import ListItemAvatar from '@mui/material/ListItemAvatar/ListItemAvatar';
import Avatar from '@mui/material/Avatar/Avatar';
import SpeedDial from '@mui/material/SpeedDial/SpeedDial';

export default observer(function ChooseMembers() {
    const {
        groupStore: { loadingFollowings, loadFollowings, followings, toggleMember, members, nextPhase, stopEditing, type, createdChannel },
        directStore: { addMembers, searchResultsContacts, searchResultsContactsGlobal, contactsSearch }
    } = useStore();
    const [substr, setSubstr] = useState('');

    useEffect(() => {
        loadFollowings();
    }, [loadFollowings]);

    useEffect(() => {
        contactsSearch(substr);
    }, [substr, contactsSearch]);

    const handleToggle = (profile: Profile) => () => {
        toggleMember(profile);
    };

    if (type !== 'group' && !createdChannel) {
        return <LoadingComponent />;
    }

    return (
        <div style={{ height: '100%' }}>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" elevation={0}>
                    <Toolbar variant="dense">
                        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={stopEditing}>
                            <ArrowBack fontSize="large" />
                        </IconButton>
                        <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: '500', fontSize: '2rem' }}>
                            Add Members
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Input
                    placeholder="Add people..."
                    sx={{ width: '100%', fontSize: '1.6rem', padding: 1.5, paddingLeft: 3.5 }}
                    size="small"
                    value={substr}
                    onChange={(e) => setSubstr(e.currentTarget.value)}
                />
            </Box>
            {substr ? (
                <List sx={{ width: '100%' }}>
                    {searchResultsContacts.map((profile) => {
                        const labelId = `checkbox-list-label-${profile.username}`;

                        return (
                            <ListItem key={profile.username} sx={{ width: '100%', padding: '0 2rem' }} disablePadding>
                                <ListItemButton
                                    role={undefined}
                                    onClick={handleToggle({ username: profile.username, displayName: profile.displayName, image: profile.image } as Profile)}
                                    sx={{ padding: '1.3rem' }}
                                    dense
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={members.findIndex((x) => x.username === profile.username) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                            sx={{ transform: 'scale(1.5)' }}
                                        />
                                    </ListItemIcon>
                                    <ListItemAvatar>
                                        <Avatar alt={`${profile.displayName}`} src={profile.image} sx={{ width: 48, height: 48 }} />
                                    </ListItemAvatar>
                                    <ListItemText id={labelId} primaryTypographyProps={{ fontSize: '1.6rem' }} primary={profile.displayName} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                    {searchResultsContactsGlobal.length > 0 && <ListItemButton sx={{ backgroundColor: 'background.paper', fontWeight: 600 }}>Global Search Results</ListItemButton>}
                    {searchResultsContactsGlobal.map((profile) => {
                        const labelId = `checkbox-list-label-${profile.username}`;

                        return (
                            <ListItem key={profile.username} sx={{ width: '100%', padding: '0 2rem' }} disablePadding>
                                <ListItemButton
                                    role={undefined}
                                    onClick={handleToggle({ username: profile.username, displayName: profile.displayName, image: profile.image } as Profile)}
                                    sx={{ padding: '1.3rem' }}
                                    dense
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={members.findIndex((x) => x.username === profile.username) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                            sx={{ transform: 'scale(1.5)' }}
                                        />
                                    </ListItemIcon>
                                    <ListItemAvatar>
                                        <Avatar alt={`${profile.displayName}`} src={profile.image} sx={{ width: 48, height: 48 }} />
                                    </ListItemAvatar>
                                    <ListItemText id={labelId} primaryTypographyProps={{ fontSize: '1.6rem' }} primary={profile.displayName} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            ) : (
                <>
                    {!loadingFollowings ? (
                        <List sx={{ width: '100%' }}>
                            {followings.map((profile) => {
                                const labelId = `checkbox-list-label-${profile.username}`;

                                return (
                                    <ListItem key={profile.username} sx={{ width: '100%', padding: '0 2rem' }} disablePadding>
                                        <ListItemButton role={undefined} onClick={handleToggle(profile)} sx={{ padding: '1.3rem' }} dense>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={members.findIndex((x) => x.username === profile.username) !== -1}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                    sx={{ transform: 'scale(1.5)' }}
                                                />
                                            </ListItemIcon>
                                            <ListItemAvatar>
                                                <Avatar alt={`${profile.displayName}`} src={profile.image} sx={{ width: 48, height: 48 }} />
                                            </ListItemAvatar>
                                            <ListItemText id={labelId} primaryTypographyProps={{ fontSize: '1.6rem' }} primary={profile.displayName} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    ) : (
                        <LoadingComponent />
                    )}
                </>
            )}
            {members.length > 0 && (
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{ position: 'absolute', bottom: 16, right: 16 }}
                    icon={type === 'group' ? <ArrowForwardIcon /> : <Done />}
                    onClick={() => {
                        if (type === 'group') nextPhase();
                        else {
                            addMembers(
                                createdChannel!,
                                members.map((x) => x.username)
                            );
                            contactsSearch('');
                            stopEditing();
                        }
                    }}
                />
            )}
        </div>
    );
});
