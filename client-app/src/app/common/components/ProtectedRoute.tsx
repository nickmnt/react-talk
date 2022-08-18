import { observer } from 'mobx-react-lite';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../../stores/store';

export interface Props {
    children: any;
}

export default observer(function ProtectedRoute({ children }: Props) {
    const {
        userStore: { user }
    } = useStore();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
});
