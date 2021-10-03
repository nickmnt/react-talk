import { observer } from "mobx-react-lite";
import React, { SyntheticEvent } from "react";
import { Button, Reveal } from "semantic-ui-react";
import { FollowNotification } from "../../app/models/notification";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: Profile | FollowNotification;
}

export default observer(function FollowButton({ profile }: Props) {
  const { profileStore, userStore } = useStore();
  const { updateFollowing, loading, updateFollowingNotif } = profileStore;

  if (userStore.user?.username === profile.username) return null;

  const handleFollow = (e: SyntheticEvent, username: string) => {
    e.preventDefault();
    
    if('displayName' in Profile) {
      profile.following
        ? updateFollowing(username, false)
        : updateFollowing(username, true);
    } else {
      profile.following
        ? updateFollowingNotif(username, false)
        : updateFollowingNotif(username, true);
    }
    
  };

  return (
    <Reveal animated="move">
      <Reveal.Content visible style={{ width: "100%" }}>
        <Button
          fluid
          color="teal"
          content={profile.following ? "Following" : "Not following"}
          style={{whiteSpace: 'nowrap', textAlign: 'center'}}
        />
      </Reveal.Content>
      <Reveal.Content hidden style={{ width: "100%" }}>
        <Button
          basic
          fluid
          color={profile.following ? "red" : "green"}
          content={profile.following ? "Unfollow" : "Follow"}
          loading={loading}
          onClick={e => handleFollow(e, profile.username)}
        />
      </Reveal.Content>
    </Reveal>
  );
});
