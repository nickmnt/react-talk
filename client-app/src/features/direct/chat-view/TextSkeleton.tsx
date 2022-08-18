import { observer } from 'mobx-react-lite';
import Paper from '@mui/material/Paper/Paper';
import Skeleton from '@mui/material/Skeleton/Skeleton';
import { useStore } from '../../../app/stores/store';

export interface Props {
    isMe: boolean;
}

export default observer(function TextSkeleton({ isMe }: Props) {
    const {
        directStore: { mode }
    } = useStore();

    const randomGen = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const rows = [];

    for (var i = 0; i < randomGen(1, 5); ++i) {
        rows.push(0);
    }

    return (
        <Paper className={`text${isMe ? '--me' : '--other'}`} sx={{ backgroundColor: isMe ? (mode === 'light' ? 'primary.light' : 'primary.dark') : 'background.paper' }} square elevation={6}>
            <div className="text__container">
                {!isMe && (
                    <div className="text__name">
                        <Skeleton variant="text" width={50} height={16} key={i} />
                    </div>
                )}
                <p className="text__content">
                    {rows.map((x, i) => (
                        <Skeleton variant="text" width={80} height={16} key={i} />
                    ))}
                </p>
            </div>
        </Paper>
    );
});
