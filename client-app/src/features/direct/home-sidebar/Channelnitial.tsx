import { ArrowBack } from '@mui/icons-material'
import { Avatar, IconButton, SpeedDial, Stack, TextField } from '@mui/material'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useStore } from '../../../app/stores/store';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { observer } from 'mobx-react-lite';


export default observer(function Channelnitial() {
    const { groupStore: {stopEditing, nextPhase, name, description,setName, setDescription} } = useStore();

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
                        onClick={stopEditing}
                    >
                        <ArrowBack fontSize="large" />
                    </IconButton>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: '500', fontSize: '2rem' }}>
                        New Channel
                    </Typography>
                </Toolbar>
              </AppBar>
            </Box>
            <Stack direction="row" spacing={2} sx={{width: '100%', marginTop: '2rem'}} alignItems="center" justifyContent="center">
                <Avatar sx={{ bgcolor: '#0080FF', width: 100, height: 100 }}>
                    <AddAPhotoIcon sx={{fontSize: '4.75rem'}}/>
                </Avatar>
            </Stack>
            <Stack direction="column" spacing={2} sx={{width: '100%', marginTop: '2rem'}} alignItems="center" justifyContent="center">
                <TextField id="channelNameField" value={name} onChange={target => setName(target.currentTarget.value)} placeholder="Channel Name" sx={{ width: '65%'}} inputProps={{style: {fontSize: '1.5rem'}}} InputLabelProps={{style: {fontSize: '1.5rem'}}}/>
                <TextField id="channelDescriptionField" value={description} onChange={target => setDescription(target.currentTarget.value)} placeholder="Description (optional)" sx={{ fontSize: '1.6rem', width: '65%' }} inputProps={{style: {fontSize: '1.5rem'}}} InputLabelProps={{style: {fontSize: '1.5rem'}}}/>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ marginTop: '2rem'}} alignItems="center" justifyContent="center">
                <Typography variant="h6" sx={{color: '#808080'}}>
                    You can provide an optional description for your channel
                </Typography>
            </Stack>
            {name.length > 0 && <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<ArrowForwardIcon />}
                onClick={nextPhase}
            />}
        </div>
    )
});