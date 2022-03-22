import React from 'react';
interface Props {
    inverted?: boolean;
    content?: string;
}

export default function LoadingComponent({ inverted = true, content = 'Loading...' }: Props) {
    return (
        <div className="loader">
            <div className="spinner" />
            <div className="loader__content">{content}</div>
        </div>
    );
}
