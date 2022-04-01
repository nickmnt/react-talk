import { FieldProps } from 'formik';
import { observer } from 'mobx-react-lite';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import React, { useEffect, useState } from 'react';
import { useStore } from '../../../app/stores/store';

export interface Props {
    props: FieldProps;
    isValid: boolean;
    handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
}

export default observer(function ChatTextInput({ props, isValid, handleSubmit }: Props) {
    const {
        directStore: { startTyping, stopTyping, currentChat }
    } = useStore();

    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!currentChat) {
            return;
        }

        if (props.field.value) {
            if (!started) {
                setStarted(true);
                startTyping(currentChat);
            }
        } else {
            if (started) {
                stopTyping(currentChat);
                setStarted(false);
            }
        }
    }, [currentChat, props.field.value, startTyping, started, stopTyping]);

    return (
        <TextareaAutosize
            maxRows={5}
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
    );
});
