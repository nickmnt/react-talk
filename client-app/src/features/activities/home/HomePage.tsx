import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../../app/stores/store';
import ForumIcon from '@mui/icons-material/Forum';
import Button from '@mui/material/Button/Button';
import LoginDialog from '../../users/LoginDialog';
import RegisterDialog from '../../users/RegisterDialog';

export default observer(function HomePage() {
    const { userStore } = useStore();
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);

    return (
        <>
            <div className="welcome">
                <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <ForumIcon className="welcome__icon" />
                            <div className="welcome__title">ReactTalk</div>
                        </div>
                        {userStore.isLoggedIn ? (
                            <>
                                <div className="welcome__mainText">Welcome! Click below to enter</div>
                                <Link to="/direct/inbox" style={{ textDecoration: 'none' }}>
                                    <Button className="welcome__enter" variant="outlined">
                                        Go to chats!
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => setLoginOpen(true)} variant="outlined" sx={{ color: 'white', borderColor: 'white', marginBottom: '1rem', fontWeight: '500' }}>
                                    Login
                                </Button>
                                <Button onClick={() => setRegisterOpen(true)} variant="outlined" sx={{ color: 'white', borderColor: 'white', fontWeight: '500' }}>
                                    Register
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
            <RegisterDialog open={registerOpen} onClose={() => setRegisterOpen(false)} />
        </>
    );
});
