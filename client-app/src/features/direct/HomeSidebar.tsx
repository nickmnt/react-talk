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
import ListItemButton from '@mui/material/ListItemButton/ListItemButton';
import Grow from '@mui/material/Grow/Grow';

const growInterval = 200;

export default observer(function HomeSidebar() {
    const {
        directStore: { localChatSearch, searchResults, chats, loadingChats, pagination, pagingParams, setPagingParams, loadChats, searchResultsGlobal },
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
        localChatSearch(searchVal);
    }, [searchVal, localChatSearch]);

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
                            <List>
                                {loadingChats
                                    ? [0, 0].map((_, i) => (
                                          <Grow in timeout={growInterval * (i + 1)}>
                                              <div>
                                                  <ChatSkeleton key={i} />
                                              </div>
                                          </Grow>
                                      ))
                                    : chats.map((chat, i) => (
                                          <Grow in timeout={growInterval * (i + 1)}>
                                              <div>
                                                  <Chat chat={chat} key={chat.id} />
                                              </div>
                                          </Grow>
                                      ))}
                            </List>
                        </InfiniteScroll>
                    ) : (
                        <List>
                            <>
                                {searchResults.length > 0 && searchResults.map((x, i) => <SearchResult searchResult={x} searchVal={searchVal} key={i} setSearchVal={setSearchVal} />)}
                                {searchResultsGlobal.length > 0 && (
                                    <>
                                        <ListItemButton sx={{ backgroundColor: '#e3e3e3', fontWeight: 600 }}>Global Search Results</ListItemButton>
                                        {searchResultsGlobal.map((x, i) => (
                                            <SearchResult searchResult={x} searchVal={searchVal} key={i} setSearchVal={setSearchVal} />
                                        ))}
                                    </>
                                )}
                            </>
                        </List>
                    )}
                </div>
            </div>
        </Paper>
    );
});
