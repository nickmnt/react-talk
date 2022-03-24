import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog/Dialog';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Slide from '@mui/material/Slide/Slide';
import { TransitionProps } from '@mui/material/transitions';
import IconButton from '@mui/material/IconButton/IconButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography/Typography';
import Stack from '@mui/material/Stack/Stack';
import { useStore } from '../../app/stores/store';
import List from '@mui/material/List/List';
import ListItemButton from '@mui/material/ListItemButton/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@mui/material/Input';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchResult from '../direct/SearchResult';
import { format } from 'date-fns';

export interface Props {
    open: boolean;
    onClose: () => void;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default observer(function ContactsDialog({ open, onClose }: Props) {
    const {
        directStore: { contactsSearch, searchResultsContacts, searchResultsContactsGlobal },
        contactsStore: { followings, loadingFollowings, loadFollowings }
    } = useStore();

    const [searching, setSearching] = useState(false);
    const [searchVal, setSearchVal] = useState('');

    const handleClose = () => {
        contactsSearch('');
        setSearching(false);
        onClose();
    };

    useEffect(() => {
        contactsSearch(searchVal);
    }, [contactsSearch, searchVal]);

    useEffect(() => {
        loadFollowings();
    }, [loadFollowings]);

    return (
        <Dialog onClose={handleClose} open={open} TransitionComponent={Transition} fullScreen>
            <AppBar position="relative" elevation={1}>
                <Toolbar variant="dense">
                    {!searching ? (
                        <>
                            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleClose}>
                                <ArrowBackIcon fontSize="large" />
                            </IconButton>
                            <Typography variant="h6">Contacts List</Typography>
                            <div style={{ flex: '1' }} />
                            <IconButton onClick={() => setSearching(true)}>
                                <SearchIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleClose}>
                                <ArrowBackIcon fontSize="large" />
                            </IconButton>
                            <div style={{ display: 'flex', flex: '1' }}>
                                <Input sx={{ flex: '1' }} value={searchVal} onChange={(e) => setSearchVal(e.target.value)} />
                            </div>
                            {searchVal && (
                                <IconButton size="large" color="inherit" onClick={() => setSearchVal('')}>
                                    <CloseIcon fontSize="large" />
                                </IconButton>
                            )}
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%' }}>
                    <div style={{ width: '100%' }}>
                        <Stack>
                            <List sx={{ width: '100%' }} disablePadding>
                                {searchVal ? (
                                    <>
                                        {searchResultsContacts.length > 0 &&
                                            searchResultsContacts.map((x, i) => <SearchResult searchResult={x} searchVal={searchVal} key={i} setSearchVal={setSearchVal} />)}
                                        {searchResultsContactsGlobal.length > 0 && (
                                            <>
                                                {searchResultsContactsGlobal.map((x, i) => (
                                                    <SearchResult searchResult={x} searchVal={searchVal} key={i} setSearchVal={setSearchVal} />
                                                ))}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {followings?.map((x, i) => (
                                            <ListItemButton key={i}>
                                                <ListItemAvatar sx={{ position: 'relative', overflow: 'visible' }}>
                                                    <Avatar alt={x.displayName} src={x.image} sx={{ width: 48, height: 48 }}></Avatar>
                                                </ListItemAvatar>
                                                <div className="chat__right">
                                                    <div className="chat__rightTop" style={{ width: '100%' }}>
                                                        <div className="chat__name">{x.displayName}</div>
                                                        <div>@{x.username}</div>
                                                    </div>
                                                    <div className="chat__rightBottom" style={{ color: x.isOnline ? 'primary.main' : 'inherit' }}>
                                                        {x.isOnline ? 'online' : 'Last seen at ' + format(x.lastSeen, 'yyyy-MM-dd HH:mm')}
                                                    </div>
                                                </div>
                                            </ListItemButton>
                                        ))}
                                    </>
                                )}
                                {loadingFollowings && <Typography variant="h6">Loading contacts...</Typography>}
                            </List>
                        </Stack>
                    </div>
                </div>
            </div>
        </Dialog>
    );
});
