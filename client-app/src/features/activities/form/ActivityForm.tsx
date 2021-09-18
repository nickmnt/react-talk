import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import {useEffect, useState} from 'react';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { ActivityFormValues } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';


export default observer(function ActivityForm() {
    const history = useHistory();
    const {activityStore} = useStore();
    const {createActivity, updateActivity, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams<{id: string}>();


    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required').nullable(),
        venue: Yup.string().required(),
        city: Yup.string().required(),
    });


    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

    useEffect(() => {
        if(id) {
            loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)));
        }
    }, [id, loadActivity]);

    const handleFormSubmit = async (activity: ActivityFormValues) => {

        if(!activity.id) {
            const activityId = await createActivity(activity);
            if(activityId !== "") {
                history.push(`/activities/${activityId}`);
            }
        } else {
            updateActivity(activity);
            history.push(`/activities/${activity.id}`);
        }
    }

    if(loadingInitial)
        return <LoadingComponent content='Loading activity...' />

    return (
        <Segment clearing>
            <Header content='Activity Detials' sub color='teal' /> 
            <Formik validationSchema={validationSchema} enableReinitialize initialValues={activity} onSubmit={values => handleFormSubmit(values)}>
                {({handleSubmit, isValid, isSubmitting, dirty}) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='title' placeholder='Title' />
                        <MyTextArea rows={3} placeholder='Description' name='description' />
                        <MySelectInput options={categoryOptions} placeholder='Category' name='category' />
                        <MyDateInput
                            placeholderText='Date' 
                            name='date' 
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header content='Location Detials' sub color='teal' /> 
                        <MyTextInput placeholder='City' name='city' />
                        <MyTextInput placeholder='Venue' name='venue' />
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            floated='right'
                            positive type='submit'
                            content='Submit'
                            loading={isSubmitting} 
                        />
                        <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>
            
        </Segment>
    )
});