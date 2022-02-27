import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../../app/stores/store';
import LoginForm from '../../users/LoginForm';
import RegisterForm from '../../users/RegisterForm';
import ForumIcon from '@mui/icons-material/Forum';
import Typography from '@mui/material/Typography/Typography';
import Button from '@mui/material/Button/Button';
import LoginDialog from '../../users/LoginDialog';
import RegisterDialog from '../../users/RegisterDialog';

export default observer(function HomePage() {
    const { userStore, modalStore } = useStore();
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);

    return (
        <>
            <div className="welcome">
                <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <ForumIcon sx={{ width: '15rem', height: '15rem', color: 'white', marginRight: '1rem' }} />
                            <Typography variant="h1" sx={{ color: 'white' }}>
                                ReactTalk
                            </Typography>
                        </div>
                        {userStore.isLoggedIn ? (
                            <>
                                <Typography variant="h6" sx={{ color: 'white' }}>
                                    Welcome! Click below to enter
                                </Typography>
                                <Link to="/direct/inbox" style={{ textDecoration: 'none' }}>
                                    <Button sx={{ fontSize: '2rem', marginTop: '1rem', color: 'white', borderColor: 'white', fontWeight: '500' }} variant="outlined">
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
