import React from 'react';
import HomePage from '../../features/home/HomePage';
import LoginForm from '../../features/users/LoginForm';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import { useStore } from '../stores/store';
import { useEffect } from 'react';
import LoadingComponent from './LoadingComponent';
import Inbox from '../../features/direct/Inbox';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import ServerError from '../../features/errors/ServerError';
import ScrollToTop from './ScrollToTop';
import Navigation from '../common/utility/Navigation';

function App() {
    const {
        commonStore,
        userStore,
        directStore: { mode, setTheme, setMode }
    } = useStore();

    const theme = React.useMemo(
        () =>
            createTheme({
                typography: {
                    // In Japanese the characters are usually larger.
                    htmlFontSize: 10,
                    fontFamily: [
                        'Roboto',
                        '-apple-system',
                        'BlinkMacSystemFont',
                        '"Segoe UI"',
                        '"Helvetica Neue"',
                        'Arial',
                        'sans-serif',
                        '"Apple Color Emoji"',
                        '"Segoe UI Emoji"',
                        '"Segoe UI Symbol"'
                    ].join(',')
                },
                palette: {
                    mode,
                    primary: {
                        light: '#bb86fc',
                        main: '#6200ee',
                        dark: '#3700b3'
                    },
                    secondary: {
                        light: '#ffcbbd',
                        main: '#e69a8d',
                        dark: '#b26b60'
                    }
                }
            }),
        [mode]
    );

    useEffect(() => {
        setTheme(theme);
    }, [setTheme, theme]);

    useEffect(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
            const newColorScheme: 'light' | 'dark' = event.matches ? 'dark' : 'light';
            setMode(newColorScheme);
        });
    });

    useEffect(() => {
        if (commonStore.token) {
            userStore.getUser().finally(() => {
                commonStore.setAppLoaded();
            });
        } else {
            commonStore.setAppLoaded();
        }
    }, [commonStore, userStore]);

    if (!commonStore.appLoaded)
        return (
            <div className="baseSettings">
                <ThemeProvider theme={theme}>
                    <LoadingComponent content="Loading app..." />
                </ThemeProvider>
            </div>
        );

    return (
        <ThemeProvider theme={theme}>
            <div className="baseSettings">
                <ToastContainer position="bottom-right" hideProgressBar />
                <BrowserRouter>
                    <ScrollToTop />
                    <Navigation />
                    <Routes>
                        <Route path="/">
                            <Route index element={<HomePage />} />
                            <Route path="/direct/inbox" element={<Inbox />} />
                            <Route path="/server-error" element={<ServerError />} />
                            <Route path="/login" element={<LoginForm />} />
                            <Route element={<NotFound />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </ThemeProvider>
    );
}

export default observer(App);
