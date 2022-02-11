import { differenceInYears, format } from 'date-fns';
import React from 'react';
import { Message } from '../../../../app/models/chat';

export interface Props {
    message: Message;
}

export default function DateMessage({ message }: Props) {
    var currentYear = new Date().getUTCFullYear();
    let value = '';
    if (differenceInYears(currentYear, message.createdAt) >= 1) {
        value = format(message.createdAt, 'MMMM dd,yy');
    } else {
        value = format(message.createdAt, 'MMMM d');
    }

    return (
        <div
            style={{
                margin: '0 auto',
                height: '2rem',
                backgroundColor: 'rgba(54, 54, 54, 0.5)',
                fontWeight: 600,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                borderRadius: '3rem'
            }}
        >
            {value}
        </div>
    );
}
