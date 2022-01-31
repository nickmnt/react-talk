import IconButton from "@mui/material/IconButton/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Typography from "@mui/material/Typography/Typography";

export interface Props {
    count: number;
    clearSelected: () => void;
    copyMessages: () => void;
}

export default function SelectHeader({count, clearSelected, copyMessages}: Props) {

    return (
        <div className="chatHeader">
            <div>
                <IconButton >
                    <CloseIcon onClick={clearSelected} />
                </IconButton>
            </div>
            <>
            <div className="chatHeader__left">
                <Typography variant="h6" sx={{color: '#363636'}}>
                    {count}
                </Typography>
            </div>
            <div className="chatHeader__right">
                <IconButton onClick={copyMessages}>
                    <ContentCopyIcon />
                </IconButton>
                <IconButton>
                    <ShortcutIcon />
                </IconButton>
                <IconButton>
                    <DeleteOutlineIcon />
                </IconButton>
            </div>
            </>
        </div>
    );
};