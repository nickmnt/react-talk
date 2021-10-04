import { Link } from 'react-router-dom'
import { Item } from 'semantic-ui-react'
import { CommentNotification } from '../models/notification'
import { formatDistanceToNow } from 'date-fns'

interface Props {
    commentNotification: CommentNotification;
}

export default function CommentNotifDisplay({commentNotification: {image, username, activityId, createdAt}}: Props) {
    return (
        <Item>
            <Item.Image size='mini' circular src={image || '/assets/user.png'} />
            <Item.Content verticalAlign='middle' >
                <Link to={`/profiles/${username}`} style={{color: '#000'}}>
                    <strong>{username} </strong>
                </Link>
                commented on your
                <Link to={`/activities/${activityId.toLowerCase()}`} style={{color: '#000'}}>
                    <strong> activity</strong>
                </Link>.
                <div style={{color: 'lightgrey'}}> {formatDistanceToNow(createdAt)} ago</div>
            </Item.Content> 
        </Item>
    )
}