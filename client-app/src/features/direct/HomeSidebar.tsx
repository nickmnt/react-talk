import Actions from './Actions';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import SearchResult from './SearchResult';
import ChooseMembers from './home-sidebar/ChooseMembers';
import GroupFinalization from './home-sidebar/GroupFinalization';
import Channelnitial from './home-sidebar/Channelnitial';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper/Paper';
import ChatSkeleton from './home-sidebar/ChatSkeleton';
import Chat from './chat/Index';

export default observer(function HomeSidebar() {
    const {
        directStore: { searchChats, searchResults, chats, loadingChats },
        groupStore: { editing, phase, type }
    } = useStore();
    const [searchVal, setSearchVal] = useState('');

    useEffect(() => {
        searchChats(searchVal);
    }, [searchVal, searchChats]);

    if (editing) {
        if (type === 'group') {
            switch (phase) {
                case 0:
                    return <ChooseMembers />;
                case 1:
                    return <GroupFinalization />;
            }
        } else if (type === 'channel') {
            switch (phase) {
                case 0:
                    return <Channelnitial />;
                case 1:
                    return <ChooseMembers />;
            }
        }
    }

    return (
        <Paper square className="homeSidebar" elevation={0}>
            <Actions searchVal={searchVal} setSearchVal={setSearchVal} />
            <div className="homeSidebar__chats">
                {!searchVal ? (
                    <List disablePadding>
                        {loadingChats ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => <ChatSkeleton key={i} />) : chats.map((chat) => <Chat chat={chat} key={chat.id} />)}
                    </List>
                ) : (
                    <List>
                        {searchResults.map((result) => (
                            <SearchResult searchResult={result} key={result.username} setSearchVal={setSearchVal} />
                        ))}
                    </List>
                )}
            </div>
        </Paper>
    );
});
