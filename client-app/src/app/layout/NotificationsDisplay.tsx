import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Icon, Item, Popup } from "semantic-ui-react";
import { CommentNotification, FollowNotification, JoinNotification } from "../models/notification";
import { useStore } from "../stores/store";
import CommentNotifDisplay from "./CommentNotifDisplay";
import FollowNotifDisplay from "./FollowNotifDisplay";
import JoinNotifDisplay from "./JoinNotifDisplay";

export default observer(function NotificationsDisplay() {
  const {
    notificationStore: {
      createHubConnection,
      clearNotifications,
      commentNotifications,
      joinNotifications,
      followNotifications,
    },
  } = useStore();

  const [notifELements, setNotifElements] = useState<JSX.Element[]>([]);

  useEffect(() => {

    //if(notifELements.length === 0) {
        const notifications: (JoinNotification | FollowNotification | CommentNotification)[] = [...joinNotifications,...commentNotifications, ...followNotifications];

        notifications.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime());

        const elements: JSX.Element[] = [];

        let i = 0;
        notifications.forEach(notification => {

            switch(notification.type) {
              case 'join':
                elements.unshift(<JoinNotifDisplay joinNotification={notification as JoinNotification} key={i}/>);
                break;  
              case 'follow':
                elements.unshift(<FollowNotifDisplay followNotification={notification as FollowNotification} key={i}/>);
                break;
              case 'comment':
                elements.unshift(<CommentNotifDisplay commentNotification={notification as CommentNotification} key={i}/>);
                break;
            }

            ++i;
        });

        setNotifElements(elements);

    //}

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentNotifications, joinNotifications, followNotifications]);

  useEffect(() => {
    createHubConnection();

    return () => {
      clearNotifications();
    };
  }, [createHubConnection, clearNotifications]);

  return <Popup trigger={<Icon name="bell" size="large" />} hoverable>
    <Item.Group>
      {notifELements}
    </Item.Group>
  </Popup>;
});
