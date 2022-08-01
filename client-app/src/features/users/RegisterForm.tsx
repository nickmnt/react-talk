import { ErrorMessage, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import ValidationErrors from '../errors/ValidationErrors';
import Typography from '@mui/material/Typography/Typography';
import Button from '@mui/material/Button/Button';
import Paper from '@mui/material/Paper/Paper';
import { GrowList } from '../../app/common/components/GrowList';

export default observer(function RegisterForm() {
    const { userStore } = useStore();
    const { register } = userStore;

    return (
        <Formik
            initialValues={{ displayName: '', username: '', email: '', password: '', error: null }}
            onSubmit={(values, { setErrors, setSubmitting }) => {
                const { error, ...rest } = values;
                register(rest).catch((error) => setErrors({ error }));
                setSubmitting(false);
            }}
            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                username: Yup.string().required(),
                email: Yup.string().required().email(),
                password: Yup.string().required()
            })}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form onSubmit={handleSubmit} autoComplete="off">
                    <Paper sx={{ padding: '3rem' }}>
                        <GrowList interval={300}>
                            <Typography variant="h3" textAlign="center" sx={{ marginBottom: '1rem' }}>
                                Sign up to ReactTalk
                            </Typography>
                            <MyTextInput name="displayName" placeholder="Display Name" />
                            <MyTextInput name="username" placeholder="Username" />
                            <MyTextInput name="email" placeholder="Email" />
                            <MyTextInput name="password" placeholder="Password" type="password" />
                            <ErrorMessage name="error" render={() => <ValidationErrors errors={errors.error} />} />
                            <Button sx={{ width: '100%', marginTop: '1rem', color: 'white', borderColor: 'white' }} variant="contained" disabled={!isValid || !dirty || isSubmitting} type="submit">
                                Register
                            </Button>
                        </GrowList>
                    </Paper>
                </Form>
            )}
        </Formik>
    );
});
