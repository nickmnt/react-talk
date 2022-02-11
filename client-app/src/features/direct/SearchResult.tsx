import { observer } from 'mobx-react-lite';
import { SearchChatDto } from '../../app/models/chat';
import { useStore } from '../../app/stores/store';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

interface Props {
    searchResult: SearchChatDto;
    setSearchVal: (value: string) => void;
}

export default observer(function SearchResult({ searchResult, setSearchVal }: Props) {
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
                    <div className="chat__name">{searchResult.displayName}</div>
                </div>
            </div>
        </ListItemButton>
    );
});
