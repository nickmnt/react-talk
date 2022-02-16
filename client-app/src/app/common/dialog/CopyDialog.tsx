import Dialog from '@mui/material/Dialog/Dialog';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Typography from '@mui/material/Typography/Typography';
import List from '@mui/material/List/List';
import ListItem from '@mui/material/ListItem/ListItem';
import ListItemButton from '@mui/material/ListItemButton/ListItemButton';
import Zoom from '@mui/material/Zoom/Zoom';

export interface Props {
    open: boolean;
    onClose: () => void;
    onCopy?: () => void;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Zoom ref={ref} {...props} />;
});

export default observer(function NameDialog({ open, onClose, onCopy }: Props) {
    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open} TransitionComponent={Transition}>
            <List sx={{ width: '100%', minWidth: '20rem' }}>
                <ListItem
                    disablePadding
                    onClick={() => {
                        if (onCopy) {
                            onCopy();
                        }
                        handleClose();
                    }}
                >
                    <ListItemButton>
                        <Typography variant="h6" sx={{ fontSize: '1.6rem', fontWeight: '500', marginLeft: '.5rem' }}>
                            Copy
                        </Typography>
                    </ListItemButton>
                </ListItem>
            </List>
        </Dialog>
    );
});
