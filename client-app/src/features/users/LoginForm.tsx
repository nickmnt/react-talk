import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography/Typography';
import { ErrorMessage, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/stores/store';

export default observer(function LoginForm() {
    const { userStore } = useStore();
    const { login } = userStore;

    return (
        <Formik initialValues={{ email: '', password: '', error: null }} onSubmit={(values, { setErrors }) => login(values).catch((error) => setErrors({ error: 'Invalid email or password' }))}>
            {({ handleSubmit, isSubmitting, errors }) => (
                <Form onSubmit={handleSubmit} autoComplete="off" className="login">
                    <Typography variant="h3" color="white" textAlign="center" sx={{ marginBottom: '1rem' }}>
                        Login to ReactTalk
                    </Typography>
                    <MyTextInput name="email" placeholder="Email" />
                    <MyTextInput name="password" placeholder="Password" type="password" />
                    <ErrorMessage name="error" render={() => <Typography style={{ margin: '.5rem 0', color: 'red' }}>{errors.error}</Typography>} />
                    <Button sx={{ width: '100%', marginTop: '1rem', color: 'white', borderColor: 'white' }} variant="outlined" disabled={isSubmitting} type="submit">
                        Login
                    </Button>
                </Form>
            )}
        </Formik>
    );
});
