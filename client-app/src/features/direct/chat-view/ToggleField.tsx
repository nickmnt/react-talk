import ListItem from '@mui/material/ListItem/ListItem';
import ListItemButton from '@mui/material/ListItemButton/ListItemButton';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import Switch from '@mui/material/Switch/Switch';
import { FormikTouched, useField } from 'formik';
import { GroupMemberPermissions } from '../../../app/models/chat';

export interface ToggleFieldProps {
    name: string;
    label: string;
    values: GroupMemberPermissions;
    touched: FormikTouched<GroupMemberPermissions>;
    setFieldValue: any;
}

// toggle field converts yes or no to true or false
export const ToggleField = (props: ToggleFieldProps) => {
    const [field] = useField<boolean>(props);

    // const onChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    //     event.preventDefault();
    //     if (props.name === 'sendMessages' && checked === false) {
    //         props.setFieldValue('sendMedia', false);
    //     }
    //     if (props.name === 'sendMedia' && checked === true) {
    //         props.setFieldValue('sendMessages', true);
    //     }
    //     field.onChange(event);
    // };

    // use `field` but override onChange
    return (
        <ListItem
            onClick={() => {
                if (props.name === 'sendMessages' && !field.value === false) {
                    props.setFieldValue('sendMedia', false);
                }
                if (props.name === 'sendMedia' && !field.value === true) {
                    props.setFieldValue('sendMessages', true);
                }
                props.setFieldValue(field.name, !field.value);
            }}
            secondaryAction={<Switch {...field} checked={field.value} />}
            sx={{ paddingRight: '1rem' }}
        >
            <ListItemButton>
                <ListItemText primaryTypographyProps={{ fontSize: '1.6rem' }} primary={props.label} />
            </ListItemButton>
        </ListItem>
    );
};
