import { IconButton, TextareaAutosize } from '@mui/material';
import { Field, FieldProps, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import Paper from '@mui/material/Paper/Paper';
import SendIcon from '@mui/icons-material/Send';
import { useStore } from '../../../app/stores/store';
import { ChatDto } from '../../../app/models/chat';

export interface Props {
    selected: ChatDto[];
}

export default observer(function ForwardInput({ selected }: Props) {
    const {
        directStore: { forward }
    } = useStore();

    return (
        <Paper square className="chatInput" elevation={3}>
            <svg className="chatInput__emoji" width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                <path d="M1262 1075q-37 121-138 195t-228 74-228-74-138-195q-8-25 4-48.5t38-31.5q25-8 48.5 4t31.5 38q25 80 92.5 129.5t151.5 49.5 151.5-49.5 92.5-129.5q8-26 32-38t49-4 37 31.5 4 48.5zm-494-435q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm512 0q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm256 256q0-130-51-248.5t-136.5-204-204-136.5-248.5-51-248.5 51-204 136.5-136.5 204-51 248.5 51 248.5 136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5zm128 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" />
            </svg>
            <Formik
                onSubmit={(values, { resetForm }) => {
                    forward(
                        selected.map((x) => x.id),
                        values.body
                    );
                }}
                initialValues={{ body: '' }}
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
                        <IconButton onClick={() => isValid && handleSubmit()}>
                            <SendIcon sx={{ color: '#007fff' }} />
                        </IconButton>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
});
