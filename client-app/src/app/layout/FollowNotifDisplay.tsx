import React from 'react'
import { Link } from 'react-router-dom'
import { Item } from 'semantic-ui-react'
import { FollowNotification } from '../models/notification'

interface Props {
    followNotification: FollowNotification;
}

export default function FollowNotifDisplay({followNotification}: Props) {
    return (
        <Item>
            <Item.Image size='mini' circular src={followNotification.followerImage || '/assets/user.png'} />
            <Item.Content verticalAlign='middle' >
                <Link to={`/profiles/${followNotification.followerUsername}`} style={{color: '#000'}}>
                    <strong>{followNotification.followerUsername} </strong>
                </Link>
                started following you.
            </Item.Content> 
        </Item>
    )
}
