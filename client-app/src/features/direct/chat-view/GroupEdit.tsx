import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { ChatPage } from '../../../app/models/chat';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton/IconButton';
import Avatar from '@mui/material/Avatar/Avatar';
import Paper from '@mui/material/Paper/Paper';
import List from '@mui/material/List/List';
import ListItemButton from '@mui/material/ListItemButton/ListItemButton';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import { useStore } from '../../../app/stores/store';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Stack from '@mui/material/Stack/Stack';
import Input from '@mui/material/Input/Input';
import MenuList from '@mui/material/MenuList/MenuList';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import LockIcon from '@mui/icons-material/Lock';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { observer } from 'mobx-react-lite';

export interface Props {
    chatPage: ChatPage;
}

export default observer(function GroupEdit({ chatPage }: Props) {
    const {
        directStore: { currentChat },
        chatStore: { removeFromStack, addPermissionsAllToStack },
        photoStore: { setPhotoOpen }
    } = useStore();

    if (!currentChat) return null;

    return (
        <div
            style={{
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                position: 'absolute',
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <AppBar position="relative" elevation={1}>
                    <Toolbar variant="dense">
                        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => removeFromStack(chatPage)}>
                            <ArrowBackIcon fontSize="large" />
                        </IconButton>
                        <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: '500', fontSize: '2rem' }}>
                            Edit
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Paper style={{ margin: 'auto 0' }} className="groupEdit" elevation={3} square>
                    <Paper square sx={{ marginBottom: '1rem' }}>
                        <Stack
                            direction="column"
                            spacing={2}
                            sx={{
                                width: '100%',
                                marginBottom: '2rem',
                                position: 'relative',
                                paddingBottom: '2rem'
                            }}
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ padding: '1.5rem' }}>
                                <Avatar sx={{ width: 80, height: 80 }} alt="Okay" src={currentChat.image} />
                                <Input
                                    defaultValue={currentChat.displayName}
                                    sx={{
                                        fontSize: '1.6rem',
                                        padding: 1.5,
                                        paddingLeft: 3.5,
                                        height: '4rem'
                                    }}
                                />
                            </Stack>
                            <Input placeholder="Description (optional)" sx={{ width: '90%' }} />
                        </Stack>
                    </Paper>

                    {/* <Paper
                        square
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '1rem',
                            paddingBottom: '1rem',
                            width: '100%'
                        }}
                    >
                        <Stack justifyContent="space-around" sx={{ width: '100%' }} direction={{ sm: 'column', md: 'row' }}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Group Type</FormLabel>
                                <RadioGroup aria-label="Group Type" name="controlled-radio-buttons-group" value={'private'}>
                                    <FormControlLabel value="private" control={<Radio />} label="Private" />
                                    <FormControlLabel value="public" control={<Radio />} label="Public" />
                                </RadioGroup>
                            </FormControl>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Chat History for new members</FormLabel>
                                <RadioGroup aria-label="Chat History" name="controlled-radio-buttons-group" value={'hidden'}>
                                    <FormControlLabel value="hidden" control={<Radio />} label="Hidden" />
                                    <FormControlLabel value="visible" control={<Radio />} label="Visible" />
                                </RadioGroup>
                            </FormControl>
                        </Stack>
                    </Paper> */}
                    <Paper
                        square
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '1rem',
                            paddingBottom: '1rem'
                        }}
                    >
                        <MenuList sx={{ width: '100%' }}>
                            <MenuItem onClick={() => setPhotoOpen(true, true)}>
                                <ListItemIcon sx={{ marginRight: '.5rem' }}>
                                    <AddAPhotoIcon fontSize="large" />
                                </ListItemIcon>
                                <ListItemText primaryTypographyProps={{ fontSize: 14 }}>Add a new photo</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => addPermissionsAllToStack(currentChat)}>
                                <ListItemIcon sx={{ marginRight: '.5rem' }}>
                                    <LockIcon fontSize="large" />
                                </ListItemIcon>
                                <ListItemText primaryTypographyProps={{ fontSize: 14 }}>Permissions</ListItemText>
                            </MenuItem>
                            {/* <MenuItem>
                                <ListItemIcon>
                                    <LocalPoliceOutlinedIcon fontSize="large" />
                                </ListItemIcon>
                                <ListItemText primaryTypographyProps={{ fontSize: 14 }}>Administrators</ListItemText>
                            </MenuItem> */}
                        </MenuList>
                    </Paper>
                    <Paper
                        square
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            paddingBottom: '1rem',
                            alignItems: 'center'
                        }}
                    >
                        <List sx={{ width: '100%' }}>
                            <ListItemButton sx={{ color: 'error.main', fontSize: '1.8rem', fontWeight: 600 }}>Delete and Leave Group</ListItemButton>
                        </List>
                    </Paper>
                </Paper>
            </Box>
        </div>
    );
});
