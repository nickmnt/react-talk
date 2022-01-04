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
import IconButton from '@mui/material/IconButton/IconButton';
import Stack from '@mui/material/Stack/Stack';
import Avatar from '@mui/material/Avatar/Avatar';
import Button from '@mui/material/Button/Button';
import Paper from '@mui/material/Paper/Paper';
import ListItem from '@mui/material/ListItem/ListItem';
import ListItemButton from '@mui/material/ListItemButton/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import Tabs from '@mui/material/Tabs/Tabs';
import ListItemAvatar from '@mui/material/ListItemAvatar/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import Modal from '@mui/material/Modal/Modal';
import MenuList from '@mui/material/MenuList/MenuList';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import LocalPoliceOutlinedIcon from '@mui/icons-material/LocalPoliceOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import LockIcon from '@mui/icons-material/Lock';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export interface Props {
    chatPage: ChatPage;
}

export default observer(function ChatDetails({chatPage}: Props) {
    const [value, setValue] = useState(0);
    const { chatStore: {removeFromStack, addProfileDetailsToStack, addAddMembersToStack} } = useStore();
    const {accountData, groupData, channelData} = chatPage;
    const [open, setOpen] = useState('');
    const handleOpen = (username: string) => setOpen(username);
    const handleClose = () => setOpen('');

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '0px solid #000',
        boxShadow: 24,
        borderRadius: 2,
      };      

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    if(!accountData && !groupData && !channelData)
        return <LoadingComponent />

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
                        <ArrowBackIcon fontSize="large" />
                    </IconButton>
                    <div style={{flexGrow: 1}}>
                    </div>
                    <IconButton sx={{}}>
                        <MoreVertIcon />
                    </IconButton>
                    </Toolbar>
                    <Stack direction="row" spacing={2} sx={{width: '100%', marginTop: '2rem', marginBottom: '2rem', position: 'relative'}} alignItems="center" justifyContent="center">
                        <Avatar sx={{ width: 100, height: 100 }} alt="Okay" src="/broken-image.jpg"/>
                        <Typography variant="h3" sx={{color: '#333', fontWeight: '500'}}>
                            {accountData && accountData.displayName}
                            {groupData && groupData.displayName}
                            {channelData && channelData.displayName}
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
                        {(accountData?.bio || groupData?.groupChat?.description || channelData?.channelChat?.description) &&
                        <ListItem>
                            <ListItemButton component="a" href="#simple-list">
                                <ListItemIcon>
                                    <InfoOutlinedIcon sx={{width: 35, height: 35}}/>
                                </ListItemIcon>
                                <Stack direction="column" spacing={.25}>
                                    <Typography variant="h5" sx={{color: '#333', fontWeight: '500', marginTop: '1.5rem', marginLeft: 'rem'}}>
                                        {accountData?.bio && accountData?.bio}
                                        {groupData?.groupChat?.description && groupData?.groupChat?.description}
                                        {channelData?.channelChat?.description && channelData?.channelChat?.description}
                                    </Typography>
                                    <Typography variant="h5" sx={{color: '#595959', fontWeight: '500', marginTop: '1.5rem', marginLeft: 'rem'}}>
                                        Bio
                                    </Typography>
                                </Stack>
                            </ListItemButton>
                        </ListItem>
                        }
                        {accountData?.username && <ListItem>
                            <ListItemButton component="a" href="#simple-list">
                                <ListItemIcon>
                                    <AlternateEmailIcon sx={{width: 35, height: 35}}/>
                                </ListItemIcon>
                                <Stack direction="column" spacing={.25}>
                                    <Typography variant="h5" sx={{color: '#333', fontWeight: '500', marginTop: '1.5rem', marginLeft: 'rem'}}>
                                        {accountData?.username}
                                    </Typography>
                                    <Typography variant="h5" sx={{color: '#595959', fontWeight: '500', marginTop: '1.5rem', marginLeft: 'rem'}}>
                                        Username
                                    </Typography>
                                </Stack>
                            </ListItemButton>
                        </ListItem>
                        }
                        </Stack>
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{width: '100%'}} alignItems="center" justifyContent="center">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '60%' }}>
                        <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example">
                            {groupData?.groupChat?.members && 
                            <Tab label="Members" sx={{fontSize: '1.4rem'}} />
                            }
                            {channelData?.channelChat?.members && 
                            <Tab label="Members" sx={{fontSize: '1.4rem'}} />
                            }
                            <Tab label="Media" sx={{fontSize: '1.4rem'}} />
                            <Tab label="Links" sx={{fontSize: '1.4rem'}} />
                            <Tab label="Voice" sx={{fontSize: '1.4rem'}} />
                            <Tab label="Groups" sx={{fontSize: '1.4rem'}} />
                        </Tabs>
                        {
                                value === 0 && (
                                    <>
                                        {groupData?.groupChat?.members && <Button variant="text" startIcon={<PersonAddOutlinedIcon />} sx={{width: '100%'}} onClick={() => addAddMembersToStack(groupData)}>
                                            Add Member
                                        </Button>}
                                        {groupData?.groupChat?.members.map(x => (
                                            <ListItem
                                                key={x.username}
                                                sx={{width:'100%', padding: '0 2rem'}}
                                                disablePadding
                                                onClick={() => addProfileDetailsToStack(x.username)}
                                                onContextMenu={(e) => {
                                                    e.preventDefault();
                                                    handleOpen(x.username);
                                                }
                                                }
                                                >
                                                <ListItemButton role={undefined}  sx={{padding: '1.3rem'}} dense>
                                                <ListItemAvatar>
                                                    <Avatar
                                                    alt={`${x.displayName}`}
                                                    src={x.image}
                                                    sx={{ width: 48, height: 48 }}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText primaryTypographyProps={{fontSize: '1.6rem'}}  primary={x.displayName} />
                                                </ListItemButton>
                                            </ListItem>

                                        ))}
                                        {channelData?.channelChat?.members && <Button variant="text" startIcon={<PersonAddOutlinedIcon />} sx={{width: '100%'}} onClick={() => addAddMembersToStack(channelData)}>
                                            Add Member
                                        </Button>}
                                        {channelData?.channelChat?.members.map(x => (
                                            <ListItem
                                            key={x.username}
                                            sx={{width:'100%', padding: '0 2rem'}}
                                            disablePadding
                                            onClick={() => addProfileDetailsToStack(x.username)}
                                            onContextMenu={(e) => {
                                                e.preventDefault();
                                                handleOpen(x.username);
                                            }
                                            }
                                            >
                                            <ListItemButton role={undefined}  sx={{padding: '1.3rem'}} dense>
                                            <ListItemAvatar>
                                                <Avatar
                                                alt={`${x.displayName}`}
                                                src={x.image}
                                                sx={{ width: 48, height: 48 }}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText primaryTypographyProps={{fontSize: '1.6rem'}}  primary={x.displayName} />
                                            </ListItemButton>
                                        </ListItem>
                                        ))}
                                        <Modal
                                                open={open.length > 0}
                                                onClose={handleClose}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={style}>
                                                    <MenuList>
                                                        <MenuItem>
                                                            <ListItemIcon>
                                                                <LocalPoliceOutlinedIcon fontSize="large"/>
                                                            </ListItemIcon>
                                                            <ListItemText primaryTypographyProps={{fontSize: 14}}>Promote to admin</ListItemText>
                                                        </MenuItem>
                                                        <MenuItem>
                                                            <ListItemIcon>
                                                                <LockIcon fontSize="large" />
                                                            </ListItemIcon>
                                                            <ListItemText primaryTypographyProps={{fontSize: 14}}>Change Permissions</ListItemText>
                                                        </MenuItem>
                                                        <MenuItem sx={{color: '#ff2800'}}>
                                                            <ListItemIcon>
                                                                <RemoveCircleOutlineOutlinedIcon sx={{color: '#ff2800'}} fontSize="large" />
                                                            </ListItemIcon>
                                                            <ListItemText primaryTypographyProps={{fontSize: 14}}>Remove from group</ListItemText>
                                                        </MenuItem>
                                                    </MenuList>
                                                </Box>
                                        </Modal>
                                    </>
                                )
                            }
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </div>
    )
})