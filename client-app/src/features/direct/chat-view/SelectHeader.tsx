import IconButton from '@mui/material/IconButton/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Typography from '@mui/material/Typography/Typography';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';

export interface Props {
    count: number;
    clearSelected: () => void;
    copyMessages: () => void;
}

export default observer(function SelectHeader({ count, clearSelected, copyMessages }: Props) {
    const {
        directStore: { setForwarding }
    } = useStore();

    return (
        <div className="chatHeader">
            <div>
                <IconButton>
                    <CloseIcon onClick={clearSelected} />
                </IconButton>
            </div>
            <>
                <div className="chatHeader__left">
                    <Typography variant="h6" sx={{ color: '#363636' }}>
                        {count}
                    </Typography>
                </div>
                <div className="chatHeader__right">
                    <IconButton onClick={copyMessages}>
                        <ContentCopyIcon />
                    </IconButton>
                    <IconButton onClick={() => setForwarding(true)}>
                        <ShortcutIcon />
                    </IconButton>
                    <IconButton>
                        <DeleteOutlineIcon />
                    </IconButton>
                </div>
            </>
        </div>
    );
});
