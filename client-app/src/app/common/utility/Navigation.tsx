import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../stores/store';

export default function Navigation() {
    const navigate = useNavigate();
    const {
        directStore: { setNavigate }
    } = useStore();
    useEffect(() => {
        setNavigate(navigate);
    }, [navigate, setNavigate]);

    return null;
}
