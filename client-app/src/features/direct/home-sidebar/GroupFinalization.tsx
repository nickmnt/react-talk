import { ArrowBack } from '@mui/icons-material'
import { Avatar, IconButton, Input, ListItemAvatar, SpeedDial, Stack } from '@mui/material'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useStore } from '../../../app/stores/store';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DoneIcon from '@mui/icons-material/Done';
import { observer } from 'mobx-react-lite';

export default observer(function GroupFinalization() {
    const {groupStore: {members, previousPhase, name, setName}} = useStore();

    return (
        <div style={{backgroundColor: 'white', height: '100%'}}>
            <Box sx={{ flexGrow: 1 }}>
              <AppBar position="static" elevation={0} sx={{backgroundColor: 'white', color:'black'}}>
                <Toolbar variant="dense">
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={previousPhase}
                    >
                        <ArrowBack fontSize="large" />
                    </IconButton>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: '500', fontSize: '2rem' }}>
                        New Group
                    </Typography>
                </Toolbar>
              </AppBar>
            </Box>
            <Stack direction="row" spacing={2} sx={{width: '100%', marginTop: '2rem'}} alignItems="center" justifyContent="center">
                <Avatar sx={{ bgcolor: '#0080FF', width: 60, height: 60 }}>
                    <AddAPhotoIcon fontSize="large"/>
                </Avatar>
                <Input value={name} onChange={target => setName(target.currentTarget.value)} placeholder="Enter group name" sx={{ fontSize: '1.6rem', padding: 1.5, paddingLeft: 3.5 }} size="small"/>
            </Stack>
            <Stack direction="row" spacing={2} sx={{width: '100%', marginTop: '3rem'}} alignItems="center" justifyContent="center">
                <Typography variant="h5" sx={{color: '#0080FF', fontWeight: '500'}}>
                    {members.length} {members.length === 1 ? "Member" : "Members"}
                </Typography>
            </Stack>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {members.map((profile) => {
        const labelId = `checkbox-list-label-${profile.username}`;

        return (
          <ListItem
            key={profile.username}
            sx={{width:'100%', padding: '0 2rem'}}
            disablePadding
          >
            <ListItemButton role={undefined}  sx={{padding: '1.3rem'}} dense>
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
    </List>
        {name.length > 0 && <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<DoneIcon />}
        />}
        </div>
    )
});