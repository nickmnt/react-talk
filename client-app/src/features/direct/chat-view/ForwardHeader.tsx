import IconButton from '@mui/material/IconButton/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography/Typography';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper/Paper';

export interface Props {
    onClose: () => void;
}

export default function ForwardHeader({ onClose }: Props) {
    return (
        <Paper className="chatHeader">
            <div>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </div>
            <>
                <div className="chatHeader__left">
                    <Typography variant="h6">Forward to...</Typography>
                </div>
                <div className="chatHeader__right">
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                </div>
            </>
        </Paper>
    );
}
