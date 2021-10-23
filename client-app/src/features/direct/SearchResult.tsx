import { observer } from 'mobx-react-lite';
import { SearchChatDto } from '../../app/models/chat';
import { useStore } from '../../app/stores/store';

interface Props {
    searchResult: SearchChatDto;
}

export default observer(function Chat({searchResult}: Props) {

    const {directStore: {setLocalChat}} = useStore();

    return (
        <div className="chat" onClick={() => setLocalChat(searchResult.displayName, searchResult.image)}>
            <div className={`chat__container`}>
                <div className="chat__left">
                    <img src={searchResult.image || "/assets/user.png"} alt="User" className="chat__img" />
                </div>
                <div className="chat__right">
                    <div className="chat__rightTop">
                        <div className="chat__name">{searchResult.displayName}</div>
                    </div>
                    <div className="chat__rightBottom">
                        <div className="last-msg">
                            @{searchResult.username}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});