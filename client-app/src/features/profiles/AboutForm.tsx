import { Form, Formik } from 'formik'
import { Button } from 'semantic-ui-react';
import * as Yup from 'yup'
import MyTextArea from '../../app/common/form/MyTextArea';
import MyTextInput from '../../app/common/form/MyTextInput';
import { Profile } from '../../app/models/profile';

interface Props {
    profile: Profile;
}

export default function AboutForm({profile}: Props) {
    const validationSchema = Yup.object({
        displayName: Yup.string().required('Required'),
        bio: Yup.string().nullable()        
    });

    const initialValues = {
        displayName: profile.displayName,
        bio: profile.bio
    };

    const onSubmit = () => {

    }
    
    return (
        <Formik 
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            {({handleSubmit, isValid, isSubmitting, dirty}) => (
                <Form className='ui form' onSubmit={onSubmit} autoComplete='off'>
                    <MyTextInput name='displayName' placeholder='Display Name' />
                    <MyTextArea rows={3} placeholder='Bio' name='bio' />    

                    <Button type="submit" disabled={!isValid || isSubmitting || !dirty} loading={isSubmitting} content='Save'color='blue' floated='right'/>
                </Form>
            )}
        </Formik>
    )
}
