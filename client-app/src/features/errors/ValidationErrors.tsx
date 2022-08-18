import Stack from '@mui/material/Stack/Stack';
import Typography from '@mui/material/Typography/Typography';
import React from 'react';

interface Props {
    errors: any;
}

export default function ValidationErrors({ errors }: Props) {
    return (
        <>
            {errors && (
                <Stack>
                    {errors.map((err: any, i: any) => (
                        <Typography color="error" key={i}>
                            {err}
                        </Typography>
                    ))}
                </Stack>
            )}
        </>
    );
}
