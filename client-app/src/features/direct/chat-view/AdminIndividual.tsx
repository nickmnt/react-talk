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
import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { ToggleField } from './ToggleField';
import Input from '@mui/material/Input/Input';
import DoneIcon from '@mui/icons-material/Done';
import Button from '@mui/material/Button/Button';
import { observer } from 'mobx-react-lite';

export interface Props {
    chatPage: ChatPage;
    member: GroupMember;
}

export default observer(function AdminIndividual({ chatPage, member }: Props) {
    const {
        chatStore: { removeFromStack },
        directStore: { updateAdminPermissions, dismissAdmin, loadingAdminPermissions }
    } = useStore();

    const formRef = useRef<FormikProps<any> | null>(null);

    return (
        <Formik
            onSubmit={(values, { resetForm }) => {}}
            initialValues={{
                deleteMessages: member.deleteMessages,
                banUsers: member.banUsers,
                addNewAdmins: member.addNewAdmins,
                remainAnonymous: member.remainAnonymous,
                customTitle: member.customTitle
            }}
            innerRef={formRef}
        >
            {({ isSubmitting, isValid, handleSubmit, dirty, values, touched, setFieldValue }) => (
                <>
                    <div
                        style={{
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            backgroundColor: 'white',
                            overflow: 'auto'
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
                                    {(dirty || member.memberType === 0) && !loadingAdminPermissions && (
                                        <IconButton size="large" onClick={() => updateAdminPermissions(chatPage.groupData!.id, member.username, values, chatPage)}>
                                            <DoneIcon fontSize="large" />
                                        </IconButton>
                                    )}
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
                                        What can this admin do?
                                    </Typography>

                                    <List sx={{ width: '60%' }}>
                                        {/* <ToggleField name="changeChatInfo" label="Change Group Info" setFieldValue={setFieldValue} values={values} touched={touched} /> */}
                                        <ToggleField name="deleteMessages" label="Delete Messages" setFieldValue={setFieldValue} values={values} touched={touched} />
                                        <ToggleField name="banUsers" label="Ban Users" setFieldValue={setFieldValue} values={values} touched={touched} />
                                        {/* <ToggleField name="inviteUsers" label="Invite Users via Link" setFieldValue={setFieldValue} values={values} touched={touched} /> */}
                                        {/* <ToggleField name="pinMessages" label="Pin Messages" setFieldValue={setFieldValue} values={values} touched={touched} /> */}
                                        <ToggleField name="addNewAdmins" label="Add New Admins" setFieldValue={setFieldValue} values={values} touched={touched} />
                                        <ToggleField name="remainAnonymous" label="Remain Anonymous" setFieldValue={setFieldValue} values={values} touched={touched} />
                                    </List>
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
                                        Custom title
                                    </Typography>
                                    <Field name="body">
                                        {(props: FieldProps) => (
                                            <Input
                                                placeholder="Admin"
                                                {...props.field}
                                                sx={{
                                                    fontSize: '1.6rem',
                                                    padding: 1.5,
                                                    height: '4rem',
                                                    width: '55%'
                                                }}
                                            />
                                        )}
                                    </Field>
                                    <Typography sx={{ fontSize: '1.6rem', color: '#8e8e8e' }}>A custom title that will be shown to all members instead of 'Admin'</Typography>
                                    {member.memberType === 1 && !loadingAdminPermissions && (
                                        <Button onClick={() => dismissAdmin(chatPage.groupData!.id, member.username, chatPage)} sx={{ width: '55%', color: '#ff2800' }}>
                                            Dismiss Admin
                                        </Button>
                                    )}
                                </Stack>
                            </Paper>
                        </Box>
                    </div>
                    {(dirty || member.memberType === 0) && !loadingAdminPermissions && (
                        <SpeedDial
                            ariaLabel="SpeedDial basic example"
                            sx={{ position: 'absolute', bottom: 16, right: 16 }}
                            icon={<Done />}
                            onClick={() => updateAdminPermissions(chatPage.groupData!.id, member.username, values, chatPage)}
                        />
                    )}
                </>
            )}
        </Formik>
    );
});
