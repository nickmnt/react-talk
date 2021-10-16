import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react'
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import ChatView from './chat-view/Index'
import HomeSidebar from './HomeSidebar'

export default observer(function Inbox() {

    const expanded = false;
    const switchExpanded = () => console.log('expanding...');

    const {directStore: {createHubConnection,clearChats, chats}} = useStore();

    useEffect(() => {
        
    }, [chats]);

    useEffect(() => {
        createHubConnection();
    
        return () => {
          clearChats();
        };
      }, [createHubConnection, clearChats]);

    return (
        <Grid>
            <Grid.Column width={16}>
        <div className="home">
            <div className={`home__container ${expanded && "home__container--expanded"}`}>
                <div className="home__sidebar">
                    <HomeSidebar />
                </div>
                <div className="home__main">
                    <ChatView />
                    <div className="home__expandRibbon" onClick={switchExpanded}>
                        <svg className="home__expand"  width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M883 1056q0 13-10 23l-332 332 144 144q19 19 19 45t-19 45-45 19h-448q-26 0-45-19t-19-45v-448q0-26 19-45t45-19 45 19l144 144 332-332q10-10 23-10t23 10l114 114q10 10 10 23zm781-864v448q0 26-19 45t-45 19-45-19l-144-144-332 332q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l332-332-144-144q-19-19-19-45t19-45 45-19h448q26 0 45 19t19 45z"/></svg>
                    </div>
                </div>
            </div>
        </div>
        </Grid.Column>
        </Grid>
    )
});