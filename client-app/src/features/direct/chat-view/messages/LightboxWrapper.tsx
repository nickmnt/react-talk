import { observer } from 'mobx-react-lite';
import { LightBox } from 'r-lightbox';
import React from 'react';
import { useStore } from '../../../../app/stores/store';
import Menu from '@mui/material/Menu/Menu';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import IconButton from '@mui/material/IconButton/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

export default observer(function LightboxWrapper() {
    const {
        directStore: { lightboxIndex, setLightboxIndex, resetLightbox, lightboxOpen, images, menuForward, canDeleteMsg, setDeleteMsgId, getMessageById }
    } = useStore();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const onForward = () => {
        menuForward(images[lightboxIndex].id);
        resetLightbox();
    };
    const onDelete = () => {
        setDeleteMsgId(images[lightboxIndex].id);
        resetLightbox();
    };
    const currentMsg = lightboxOpen ? getMessageById(images[lightboxIndex].id) : null;
    const canDelete = !!currentMsg && canDeleteMsg(currentMsg);

    const headerElem = (
        <>
            <IconButton sx={{ color: 'white' }} onClick={onForward}>
                <ShortcutIcon />
            </IconButton>
            {canDelete && (
                <IconButton sx={{ color: 'white' }} onClick={handleClick}>
                    <MoreVertIcon />
                </IconButton>
            )}
        </>
    );

    return (
        <>
            <div className="lightboxWrapper">
                <LightBox selectedIndex={lightboxIndex} setSelectedIndex={setLightboxIndex} onClose={resetLightbox} open={lightboxOpen} images={images} headerElement={headerElem} />
            </div>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
            >
                {canDelete && (
                    <MenuItem onClick={onDelete}>
                        <ListItemIcon>
                            <DeleteOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>
                )}
            </Menu>
        </>
    );
});
