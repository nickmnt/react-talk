import Actions from "./Actions";
import { useEffect, useState } from "react";
import Chat from "./chat/Index";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import SearchResult from "./SearchResult";


export default observer(function HomeSidebar() {

    const {directStore: {searchChats, searchResults, chats}} = useStore();
    const [searchVal, setSearchVal] = useState("");

    useEffect(() => {
        searchChats(searchVal);
    }, [searchVal, searchChats]);

    return (
        <div className="homeSidebar">
            <Actions searchVal={searchVal} setSearchVal={setSearchVal} />
            <div className="homeSidebar__chats"> 
                {!searchVal ? 
                <>
                {
                    chats.map((chat) => 
                    <Chat chat={chat} key={chat.id}/>
                    )
                }
                </>
                :
                <>
                    {
                        searchResults.map((result) => (
                            <SearchResult searchResult={result} key={result.username}/>
                        ))
                    }
                </>
                }
            </div>
            
        </div>
    );
});