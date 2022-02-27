import Dialog from '@mui/material/Dialog/Dialog';
import { observer } from 'mobx-react-lite';
import React, { ReactNode } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide/Slide';

export interface Props {
    open: boolean;
    onClose?: () => void;
    nonFullScreen?: boolean;
    children: ReactNode;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default observer(function NameDialog({ open, children, onClose, nonFullScreen }: Props) {
    return (
        <Dialog open={open} TransitionComponent={Transition} fullScreen={!nonFullScreen} onClose={onClose}>
            {children}
        </Dialog>
    );
});
