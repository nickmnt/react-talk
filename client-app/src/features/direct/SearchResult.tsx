import { observer } from 'mobx-react-lite';
import { SearchResult } from '../../app/models/chat';
import { useStore } from '../../app/stores/store';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

interface Props {
    searchResult: SearchResult;
    searchVal: string;
    setSearchVal: (value: string) => void;
}

export default observer(function SearchResult({ searchResult, setSearchVal, searchVal }: Props) {
    const {
        directStore: { setLocalChat, chats, getChatDetails, clearSearchResults }
    } = useStore();

    const goToChat = () => {
        //Personal account
        const result = chats.find((x) => x.participantUsername === searchResult.username);
        chats.forEach((x) => console.log(x.participantUsername));
        result ? getChatDetails(result) : setLocalChat(searchResult.username, searchResult.displayName, searchResult.image);
        clearSearchResults();
        setSearchVal('');
    };

    return (
        <ListItemButton className={`chat__container`} onClick={goToChat}>
            <ListItemAvatar>
                <Avatar alt={searchResult.displayName} src={searchResult.image} sx={{ width: 48, height: 48 }} />
            </ListItemAvatar>
            <div className="chat__right">
                <div className="chat__rightTop">
                    <div className="chat__name">
                        {searchResult.startIndexDisp !== -1 ? (
                            <>
                                {searchResult.displayName.substring(0, searchResult.startIndexDisp)}
                                <span style={{ color: '#007fff' }}>{searchResult.displayName.substring(searchResult.startIndexDisp, searchResult.startIndexDisp + searchVal.length)}</span>
                                {searchResult.displayName.substring(searchResult.startIndexDisp + searchVal.length)}
                            </>
                        ) : (
                            searchResult.displayName
                        )}
                    </div>
                </div>
                {searchResult.username && (
                    <div className="chat__rightBottom">
                        <div>
                            @
                            {searchResult.startIndexUser !== -1 ? (
                                <>
                                    {searchResult.username.substring(0, searchResult.startIndexUser)}
                                    <span style={{ color: '#007fff' }}>{searchResult.username.substring(searchResult.startIndexUser, searchResult.startIndexUser + searchVal.length)}</span>
                                    {searchResult.username.substring(searchResult.startIndexUser + searchVal.length)}
                                </>
                            ) : (
                                searchResult.username
                            )}
                        </div>
                    </div>
                )}
            </div>
        </ListItemButton>
    );
});
