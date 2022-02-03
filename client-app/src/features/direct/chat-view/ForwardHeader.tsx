import IconButton from "@mui/material/IconButton/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import Typography from "@mui/material/Typography/Typography";
import SearchIcon from '@mui/icons-material/Search';

export interface Props {
    onClose: () => void;
}

export default function ForwardHeader({onClose}: Props) {

    return (
        <div className="chatHeader">
            <div>
                <IconButton onClick={onClose} >
                    <CloseIcon />
                </IconButton>
            </div>
            <>
            <div className="chatHeader__left">
                <Typography variant="h6" sx={{color: '#363636'}}>
                    Forward to...
                </Typography>
            </div>
            <div className="chatHeader__right">
                <IconButton>
                    <SearchIcon />
                </IconButton>
            </div>
            </>
        </div>
    );
};