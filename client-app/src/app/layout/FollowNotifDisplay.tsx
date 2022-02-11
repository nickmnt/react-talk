import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';
import { Item } from 'semantic-ui-react';
import FollowButton from '../../features/profiles/FollowButton';
import { FollowNotification } from '../models/notification';

interface Props {
    followNotification: FollowNotification;
}

export default function FollowNotifDisplay({ followNotification }: Props) {
    return (
        <Item>
            <Item.Image size="mini" circular src={followNotification.image || '/assets/user.png'} style={{ height: '35px' }} />
            <Item.Content verticalAlign="middle">
                <div>
                    <Link to={`/profiles/${followNotification.username}`} style={{ color: '#000' }}>
                        <strong>{followNotification.username} </strong>
                    </Link>
                    started following you.
                    <div style={{ color: 'lightgrey' }}> {formatDistanceToNow(followNotification.createdAt)} ago</div>
                </div>
            </Item.Content>
            <Item.Content>
                <FollowButton profile={followNotification} />
            </Item.Content>
        </Item>
    );
}
