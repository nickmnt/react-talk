import Avatar from '@mui/material/Avatar/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import React from 'react';

export interface Props {
    displayName: string;
    body: string;
    image: string;
    type: number;
    createdAt: Date;
}

export default function NewMessage({ displayName, body, image, createdAt, type }: Props) {
    let lastMsgText = '';
    if (body) {
        lastMsgText = body;
    } else {
        switch (type) {
            case 1:
                lastMsgText = 'Photo';
                break;
            case 2:
                lastMsgText = 'Video';
                break;
            case 3:
                lastMsgText = 'Voice';
                break;
        }
    }

    return (
        <div className="newMessage">
            <Avatar alt={displayName} src={image} className="newMessage__avatar" />
            <div className="chat__right">
                <div className="chat__rightTop">
                    <div className="chat__name">{displayName}</div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginLeft: '.5rem', fontSize: '1.2rem', fontWeight: 500 }}>{createdAt.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                    </div>
                </div>
                <div className="chat__rightBottom">
                    <div className="last-msg" style={{ display: 'flex', alignItems: 'center' }}>
                        {type === 1 && <ImageIcon sx={{ marginRight: '0.5rem' }} />}
                        {type === 2 && <VideoLibraryIcon sx={{ marginRight: '0.5rem' }} />}
                        {type === 3 && <KeyboardVoiceIcon sx={{ marginRight: '0.5rem' }} />}
                        {lastMsgText.substring(0, 15)}
                    </div>
                </div>
            </div>
        </div>
    );
}
