import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Button, Grid, Header, Tab } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import AboutForm from './AboutForm';

interface Props {
    profile: Profile;
}

export default observer(function ProfileAbout({ profile }: Props) {
    const [editing, setEditing] = useState(false);

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon="user" content={`About ${profile.displayName}`} />
                    <Button floated="right" content={editing ? 'Cancel' : 'Edit Profile'} color="blue" onClick={() => setEditing(!editing)} />
                </Grid.Column>
                <Grid.Column width={16}>
                    {editing ? (
                        <AboutForm profile={profile} setEditing={setEditing} />
                    ) : (
                        <>
                            <Header content={profile.displayName} />
                            <div style={{ whiteSpace: 'pre-line' }}>{profile.bio}</div>
                        </>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
});
