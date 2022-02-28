import { Field, FieldProps, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import Paper from '@mui/material/Paper/Paper';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import IconButton from '@mui/material/IconButton/IconButton';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import MicIcon from '@mui/icons-material/Mic';

export default observer(function ChatInputSkeleton() {
    return (
        <Paper square className="chatInput" elevation={3}>
            <IconButton>
                <SentimentSatisfiedAltIcon />
            </IconButton>
            <Formik
                initialValues={{ body: '' }}
                onSubmit={() => {}}
                validationSchema={Yup.object({
                    body: Yup.string().required()
                })}
            >
                {({ isSubmitting, isValid, handleSubmit }) => (
                    <Form className="chatInput__form">
                        <Field name="body">
                            {(props: FieldProps) => (
                                <TextareaAutosize
                                    maxRows={2}
                                    className="chatInput__input"
                                    placeholder="Message"
                                    {...props.field}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && e.shiftKey) {
                                            return;
                                        }
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            isValid && handleSubmit();
                                        }
                                    }}
                                />
                            )}
                        </Field>
                    </Form>
                )}
            </Formik>

            <IconButton>
                <AttachFileIcon />
            </IconButton>
            <IconButton>
                <MicIcon />
            </IconButton>
        </Paper>
    );
});
