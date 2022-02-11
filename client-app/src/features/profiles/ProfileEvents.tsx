import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useEffect } from 'react';
import { Card, Grid, Header, Tab, TabProps } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import ProfileEvent from './ProfileEvent';

export default observer(function ProfileEvents() {
    const {
        profileStore: { loadUserActivities, loadingActivities, userActivities, profile }
    } = useStore();

    const panes = [
        { menuItem: 'Future Events', pane: { key: 'future' } },
        { menuItem: 'Past Events', pane: { key: 'past' } },
        { menuItem: 'Hosting', pane: { key: 'hosting' } }
    ];

    useEffect(() => {
        loadUserActivities(profile!.username);
    }, [loadUserActivities, profile]);

    const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
        loadUserActivities(profile!.username, panes[data.activeIndex as number].pane.key);
    };

    return (
        <Tab.Pane loading={loadingActivities}>
            <Grid styles={{ paddingBottom: 100 }}>
                <Grid.Column width={16}>
                    <Header floated="left" icon="calendar" content={'Activities'} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab menu={{ secondary: true, pointing: true }} panes={panes} onTabChange={(e, data) => handleTabChange(e, data)} />
                    <br />
                    <Card.Group itemsPerRow={4}>
                        {userActivities.map((activity) => (
                            <ProfileEvent activity={activity} />
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
});
