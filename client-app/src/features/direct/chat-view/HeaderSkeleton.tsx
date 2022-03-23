import IconButton from '@mui/material/IconButton/IconButton';
import { observer } from 'mobx-react-lite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useStore } from '../../../app/stores/store';
import Skeleton from '@mui/material/Skeleton/Skeleton';
import Button from '@mui/material/Button/Button';
import Paper from '@mui/material/Paper/Paper';

export default observer(function HeaderSkeleton() {
    const {
        directStore: { removeCurrentChat }
    } = useStore();
    return (
        <Paper square className="chatHeader">
            <div className="chatHeader__back">
                <IconButton onClick={removeCurrentChat}>
                    <ArrowBackIcon />
                </IconButton>
            </div>
            <>
                <div className="chatHeader__left">
                    <div className="chatHeader__name">
                        <Skeleton width={80} />
                    </div>
                    <div className="chatHeader__status">
                        <Skeleton width={120} />
                    </div>
                </div>
                <div className="chatHeader__right">
                    <div className="chatHeader__right">
                        <Button variant="contained">Details</Button>
                    </div>
                </div>
            </>
        </Paper>
    );
});
