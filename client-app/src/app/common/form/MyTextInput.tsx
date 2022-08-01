import Input from '@mui/material/Input/Input';
import Typography from '@mui/material/Typography/Typography';
import { useField } from 'formik';

interface Props {
    placeholder: string;
    name: string;
    label?: string;
    type?: string;
    // Rest
    [x: string]: any;
}

export default function MyTextInput(props: Props) {
    const [field, meta] = useField(props.name);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ marginRight: '1rem' }}>{props.label}</Typography>
                <Input {...field} sx={{ width: '100%' }} error={meta.touched && !!meta.error} {...props} />
            </div>
            {meta.touched && meta.error ? <Typography color="red">{meta.error}</Typography> : null}
        </div>
    );
}
