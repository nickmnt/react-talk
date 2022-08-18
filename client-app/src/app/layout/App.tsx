import React from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router';
import HomePage from '../../features/activities/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import LoginForm from '../../features/users/LoginForm';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import { useStore } from '../stores/store';
import { useEffect } from 'react';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';
import Inbox from '../../features/direct/Inbox';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

    const location = useLocation();

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
                <ModalContainer />
                <Route path="/" component={HomePage} exact />
                <Route
                    path="/(.+)"
                    render={() => (
                        <>
                            <Switch>
                                <Route path="/direct/inbox" exact component={Inbox} />
                                <>
                                    <Container className="activitiesContainer">
                                        <NavBar />
                                        <Switch>
                                            <Route path="/activities" component={ActivityDashboard} exact />
                                            <Route path="/activities/:id" component={ActivityDetails} />
                                            <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
                                            <Route path="/profiles/:username" component={ProfilePage} />
                                            <Route path="/errors" component={TestErrors} />
                                            <Route path="/server-error" component={ServerError} />
                                            <Route path="/login" component={LoginForm} />
                                            <Route component={NotFound} />
                                        </Switch>
                                    </Container>
                                </>
                            </Switch>
                        </>
                    )}
                />
            </div>
        </ThemeProvider>
    );
}

export default observer(App);
