import { useRef } from 'react';
import { GroupMember } from '../../../app/models/chat';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { ChatPage } from '../../../app/models/chat';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton/IconButton';
import Avatar from '@mui/material/Avatar/Avatar';
import Paper from '@mui/material/Paper/Paper';
import List from '@mui/material/List/List';
import { useStore } from '../../../app/stores/store';
import SpeedDial from '@mui/material/SpeedDial/SpeedDial';
import Done from '@mui/icons-material/Done';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Stack from '@mui/material/Stack/Stack';
import { Formik, FormikProps } from 'formik';
import { ToggleField } from './ToggleField';

export interface Props {
    chatPage: ChatPage;
    member: GroupMember;
}

export default function MemberPermissions({ member, chatPage }: Props) {
    const {
        chatStore: { removeFromStack }
    } = useStore();

    const formRef = useRef<FormikProps<any> | null>(null);

    return (
        <div
            style={{
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                position: 'absolute',
                backgroundColor: 'white',
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <AppBar position="relative" elevation={1} sx={{ backgroundColor: 'white', color: 'black' }}>
                    <Toolbar variant="dense">
                        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => removeFromStack(chatPage)}>
                            <ArrowBackIcon fontSize="large" />
                        </IconButton>
                        <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: '500', fontSize: '2rem' }}>
                            Change Permissions
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Paper square sx={{ marginBottom: '1rem' }}>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            width: '100%',
                            marginTop: '2rem',
                            marginBottom: '2rem',
                            position: 'relative'
                        }}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Avatar sx={{ width: 48, height: 48 }} alt="Okay" src={member.image} />
                        <Typography variant="h4" sx={{ color: '#333', fontWeight: '500' }}>
                            {member.displayName}
                        </Typography>
                    </Stack>
                </Paper>

                <Paper square elevation={0} sx={{ flex: 1, display: 'flex' }}>
                    <Stack
                        direction="column"
                        spacing={2}
                        sx={{
                            width: '100%',
                            marginTop: '2rem',
                            marginBottom: '2rem',
                            position: 'relative',
                            flex: 1
                        }}
                        alignItems="center"
                    >
                        <Typography variant="h5" sx={{ color: '#007FFF', fontWeight: '500' }}>
                            What can this user do?
                        </Typography>

                        <Formik
                            onSubmit={(values, { resetForm }) => {}}
                            initialValues={{
                                sendMessages: true,
                                sendMedia: true,
                                addUsers: true,
                                pinMessages: true,
                                changeChatInfo: true
                            }}
                            innerRef={formRef}
                        >
                            {({ isSubmitting, isValid, handleSubmit, dirty, values, touched, setFieldValue }) => (
                                <>
                                    <List sx={{ width: '60%' }}>
                                        <ToggleField name="sendMessages" label="Send Messages" setFieldValue={setFieldValue} values={values} touched={touched} />
                                        <ToggleField name="sendMedia" label="Send Media" setFieldValue={setFieldValue} values={values} touched={touched} />
                                        <ToggleField name="addUsers" label="Add Users" setFieldValue={setFieldValue} values={values} touched={touched} />
                                        <ToggleField name="pinMessages" label="Pin Messages" setFieldValue={setFieldValue} values={values} touched={touched} />
                                        <ToggleField name="changeChatInfo" label="Change Chat Info" setFieldValue={setFieldValue} values={values} touched={touched} />
                                    </List>
                                    {dirty && <SpeedDial ariaLabel="SpeedDial basic example" sx={{ position: 'absolute', bottom: 16, right: 16 }} icon={<Done />} onClick={() => {}} />}
                                </>
                            )}
                        </Formik>
                    </Stack>
                </Paper>
            </Box>
        </div>
    );
}
