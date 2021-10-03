import React from 'react'
import { Link } from 'react-router-dom'
import { Item } from 'semantic-ui-react'
import { JoinNotification } from '../models/notification'

interface Props {
    joinNotification: JoinNotification;
}

export default function JoinNotifDisplay({joinNotification: {username, image,activityId}}: Props) {
    return (
        <Item>
            <Item.Image size='mini' circular src={image || '/assets/user.png'} />
            <Item.Content verticalAlign='middle' >
                <Link to={`/profiles/${username}`} style={{color: '#000'}}>
                    <strong>{username} </strong>
                </Link>
                joined your
                <Link to={`/activities/${activityId.toLowerCase()}`} style={{color: '#000'}}>
                    <strong> activity</strong>
                </Link>.
            </Item.Content> 
        </Item>
    )
}
