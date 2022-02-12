import { MoreVert } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton/IconButton';
import { observer } from 'mobx-react-lite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useStore } from '../../../app/stores/store';
import Skeleton from '@mui/material/Skeleton/Skeleton';

export default observer(function HeaderSkeleton() {
    const {
        directStore: { removeCurrentChat }
    } = useStore();
    return (
        <div className="chatHeader">
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
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </>
        </div>
    );
});
