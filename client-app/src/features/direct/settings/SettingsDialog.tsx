import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog/Dialog';
import Stack from '@mui/material/Stack/Stack';
import Paper from '@mui/material/Paper/Paper';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import React from 'react';
import Slide from '@mui/material/Slide/Slide';
import { TransitionProps } from '@mui/material/transitions';
import IconButton from '@mui/material/IconButton/IconButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Typography from '@mui/material/Typography/Typography';
import Avatar from '@mui/material/Avatar/Avatar';
import { truncate, truncateBasic } from '../../../app/common/utility';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import Menu from '@mui/material/Menu/Menu';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import List from '@mui/material/List/List';
import ListItem from '@mui/material/ListItem/ListItem';
import ListItemButton from '@mui/material/ListItemButton/ListItemButton';
import Skeleton from '@mui/material/Skeleton/Skeleton';
import { toast } from 'react-toastify';

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

export default observer(function SettingsDialog({ open, onClose }: Props) {
    const {
        directStore: { setNameOpen, setBioOpen, openCopy, setProfilePicsOpen },
        settingsStore: { loadProfile, profile, loadingName, loadingBio },
        photoStore: { setPhotoOpen },
        userStore: { logout }
    } = useStore();

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleClose = () => {
        onClose();
    };

    //Menu
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    if (!profile) {
        return null;
    }

    return (
        <>
            <Dialog onClose={handleClose} open={open} sx={{ minWidth: '50vw' }} TransitionComponent={Transition}>
                <AppBar position="relative" elevation={1}>
                    <Toolbar variant="dense">
                        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleClose}>
                            <CloseIcon fontSize="large" />
                        </IconButton>
                        <div style={{ flexGrow: 1 }} />
                        <IconButton onClick={handleMenuClick}>
                            <MoreVertIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Paper sx={{ width: '100%' }}>
                    <Stack sx={{ padding: '2rem', minWidth: '25rem' }} direction="row" alignItems="center">
                        <Avatar
                            src={profile.image}
                            alt={profile.displayName}
                            sx={{ width: 60, height: 60, cursor: profile.photos!.length > 0 ? 'pointer' : 'auto' }}
                            onClick={() => {
                                if (profile.photos!.length > 0) {
                                    setProfilePicsOpen(profile);
                                }
                            }}
                        >
                            {truncateBasic(profile.displayName, 2)}
                        </Avatar>
                        <Stack sx={{ marginLeft: '1.5rem' }} justifyContent="center">
                            <Typography sx={{ fontWeight: 500 }}>{loadingName ? <Skeleton width="30" height="16" /> : profile.displayName}</Typography>
                            <Typography sx={{ color: 'primary.main' }}>online</Typography>
                        </Stack>
                        <div style={{ flexGrow: 1 }} />
                        <IconButton sx={{ width: 48, height: 48 }} onClick={() => setPhotoOpen(true)}>
                            <AddAPhotoIcon sx={{ width: 36, height: 36, color: 'primary.main' }} />
                        </IconButton>
                    </Stack>
                    <Typography variant="h6" sx={{ color: 'primary.main', marginLeft: '2rem' }}>
                        Account
                    </Typography>
                    <List sx={{ width: '100%' }}>
                        <ListItem
                            disablePadding
                            onContextMenu={(e) => {
                                e.preventDefault();
                                openCopy(() => {
                                    navigator.clipboard.writeText(profile.username);
                                    toast('Username successfully copied to clipboard', { type: 'success' });
                                });
                            }}
                        >
                            <ListItemButton>
                                <Stack sx={{ width: '100%', height: '100%' }}>
                                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: '500', marginLeft: '.5rem' }}>
                                        {profile.username}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: '1.4rem', fontWeight: '400', marginLeft: '.5rem' }}>
                                        Username
                                    </Typography>
                                </Stack>
                            </ListItemButton>
                        </ListItem>
                        <ListItem
                            disablePadding
                            onClick={() => setBioOpen(true)}
                            onContextMenu={(e) => {
                                if (profile.bio) {
                                    e.preventDefault();
                                    openCopy(() => {
                                        if (profile.bio) {
                                            navigator.clipboard.writeText(profile.bio);
                                            toast('Bio successfully copied to clipboard', { type: 'success' });
                                        }
                                    });
                                }
                            }}
                        >
                            <ListItemButton>
                                <Stack sx={{ width: '100%', height: '100%' }}>
                                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: '500', marginLeft: '.5rem' }}>
                                        {loadingBio ? <Skeleton width="30" height="16" /> : profile.bio ? truncate(profile.bio, 20) : 'Bio'}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: '1.4rem', fontWeight: '400', marginLeft: '.5rem' }}>
                                        {profile.bio ? 'Bio' : 'Add a few words about yourself'}
                                    </Typography>
                                </Stack>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Paper>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleMenuClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button'
                    }}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            setNameOpen(true);
                            handleMenuClose();
                        }}
                    >
                        <ListItemIcon>
                            <EditOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Edit name</ListItemText>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setPhotoOpen(true);
                            handleMenuClose();
                        }}
                    >
                        <ListItemIcon>
                            <AddAPhotoOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Set new photo</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={logout}>
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Log out</ListItemText>
                    </MenuItem>
                </Menu>
            </Dialog>
        </>
    );
});
