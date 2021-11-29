import { ArrowBack } from '@mui/icons-material'
import { Avatar, IconButton, Input, ListItemAvatar } from '@mui/material'
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
import { useState } from 'react';


export default function ChooseMembers() {

    const [checked, setChecked] = useState([0]);

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
        newChecked.push(value);
        } else {
        newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

  
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
                    >
                        <ArrowBack fontSize="large" />
                    </IconButton>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: '500', fontSize: '2rem' }}>
                        Add Members
                    </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box sx={{width:'100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Input placeholder="Add people..." sx={{ width: '100%', fontSize: '1.6rem', padding: 1.5, paddingLeft: 3.5 }} size="small"/>
            </Box>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {[0, 1, 2, 3].map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={value}
            sx={{width:'100%', padding: '0 2rem'}}
            disablePadding
          >
            <ListItemButton role={undefined} onClick={handleToggle(value)} sx={{padding: '1.3rem'}} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                  sx={{transform: "scale(1.5)"}}
                />
              </ListItemIcon>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${value + 1}`}
                  src={`/static/images/avatar/${value + 1}.jpg`}
                  sx={{ width: 48, height: 48 }}
                />
              </ListItemAvatar>
              <ListItemText id={labelId} primaryTypographyProps={{fontSize: '1.6rem'}}  primary={`Line item ${value + 1}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>

        </div>
    )
}
