import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import DirectDrawer from './chat-view/DirectDrawer';
import Paper from '@mui/material/Paper/Paper';
import InputBase from '@mui/material/InputBase/InputBase';
import IconButton from '@mui/material/IconButton/IconButton';


interface Props {
    searchVal: string;
    setSearchVal: (val: string) => void;
}
  

export default observer(function Actions({setSearchVal, searchVal}: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    

    const toggleDrawer = 
        (open: boolean) => 
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if(
                event && 
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' || 
                 (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }

            setDrawerOpen(open);
        }

    return (
        <div className="actions">
            <DirectDrawer toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
            <IconButton onClick={toggleDrawer(true)} sx={{marginRight: '1rem'}}>
                <svg className="actions__burgerIco" width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z"/></svg>
            </IconButton>
            <Paper
                component="form"
                sx={{p: '2x 4px', display:'flex', alignItems: 'center', width: 400}}
                className='actions__form actions__search'
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search"
                    inputProps={{ 'aria-label': 'search google maps' }}
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                />
                <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>
        </div>
    );
});