import React, { useState } from 'react';
import Dialog from "@mui/material/Dialog/Dialog";
import Stack from '@mui/material/Stack/Stack';
import Paper from '@mui/material/Paper/Paper';
import Typography from '@mui/material/Typography/Typography';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import Button from '@mui/material/Button/Button';

export interface Props {
  open: boolean;
  onClose: () => void;
}

export default observer(function PinDialog({ open, onClose }: Props) {

  const {directStore: {currentChat, menuMsg, addPin }} = useStore();
  const [value, setValue] = useState(false);
  
  const handleClose = () => {
    onClose();
  };

  if(!currentChat || !menuMsg)
    return <></>;

  return <Dialog onClose={handleClose} open={open} sx={{minWidth: '50vw'}}>
    <Paper>
      <Stack sx={{padding: '2rem'}}>
        <Typography variant="h4">Pin message</Typography>
        <Typography sx={{marginTop: '1rem'}}>Do you want to pin this message at the top of the chat?</Typography>
        <FormControlLabel sx={{margin: '1.5rem 0'}} control={<Checkbox value={value} onChange={e => setValue(e.target.checked)} />} label={`Also pin for ${currentChat.type === 0 ? currentChat?.displayName : 'other members'}`} />
        <Stack flexDirection="row" justifyContent='flex-end'>
          <Button variant="text" onClick={handleClose}>Cancel</Button>
          <Button variant="text" onClick={() => addPin(currentChat.id, menuMsg?.id, value)}>Pin</Button>
        </Stack>
      </Stack>  
    </Paper>
  </Dialog>;
})