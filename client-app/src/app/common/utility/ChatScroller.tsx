import React, { useEffect, useRef, useState } from 'react';

export interface Props {
    children: React.ReactNode;
    className: string;
    threshold?: number;
    onMoreUp: () => void;
}

export default function ChatScroller({ children, className, threshold = 10, onMoreUp }: Props) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [atBottom, setAtBottom] = useState(false);

    const scrollToBottom = () => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight - ref.current.clientHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
        setAtBottom(true);
    }, []);

    useEffect(() => {
        if (atBottom) {
            scrollToBottom();
        }
    }, [atBottom, children]);

    const onScroll = () => {
        const realAtBottom = ref.current && ref.current.scrollTop + ref.current.clientHeight >= ref.current.scrollHeight - threshold;

        if (ref.current && ref.current.scrollTop <= threshold) {
            onMoreUp();
            if (ref.current.scrollTop === 0) ref.current.scrollTop = 1;
        }

        if (realAtBottom) {
            setAtBottom(true);
        } else {
            setAtBottom(false);
        }
    };

    return (
        <div ref={ref} onScroll={onScroll} style={{ overflowX: 'hidden', overflowY: 'auto' }} className={className}>
            {children}
        </div>
    );
}
