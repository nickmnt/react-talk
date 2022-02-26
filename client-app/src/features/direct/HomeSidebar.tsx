import Actions from './Actions';
import { useEffect, useRef, useState } from 'react';
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
import { PagingParams } from '../../app/models/pagination';
import InfiniteScroll from 'react-infinite-scroll-component';

export default observer(function HomeSidebar() {
    const {
        directStore: { searchChats, searchResults, chats, loadingChats, pagination, pagingParams, setPagingParams, loadChats },
        groupStore: { editing, phase, type }
    } = useStore();
    const [searchVal, setSearchVal] = useState('');
    const [loadingNext, setLoadingNext] = useState(false);

    const handleGetNext = () => {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1, pagingParams.pageSize));
        loadChats().then(() => {
            setLoadingNext(false);
        });
    };

    useEffect(() => {
        searchChats(searchVal);
    }, [searchVal, searchChats]);

    const container = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (container.current) {
            setPagingParams(new PagingParams(1, Math.ceil(container.current.clientHeight / 70)));
            loadChats();
        }
    }, [loadChats, container, setPagingParams]);

    const mustExpand =
        container.current && container.current.clientHeight >= chats.length * 70 && !searchVal && !loadingChats && !loadingNext && !!pagination && pagination.currentPage < pagination.totalPages;

    if (mustExpand) {
        handleGetNext();
    }

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
            <div ref={container} style={{ flex: 1, overflow: 'hidden', width: '100%' }}>
                <div className="homeSidebar__chats" id="chatsScroller">
                    {!searchVal ? (
                        <InfiniteScroll
                            next={handleGetNext}
                            hasMore={true}
                            loader={<></>}
                            dataLength={pagination ? pagination.totalCount : 0}
                            style={{ height: '100%' }}
                            scrollableTarget="chatsScroller"
                        >
                            {loadingChats ? [0, 0].map((_, i) => <ChatSkeleton key={i} />) : chats.map((chat) => <Chat chat={chat} key={chat.id} />)}
                        </InfiniteScroll>
                    ) : (
                        <List>
                            {searchResults.map((result) => (
                                <SearchResult searchResult={result} key={result.username} setSearchVal={setSearchVal} />
                            ))}
                        </List>
                    )}
                </div>
            </div>
        </Paper>
    );
});
