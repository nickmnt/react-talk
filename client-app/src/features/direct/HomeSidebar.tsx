import Actions from "./Actions";
import { useEffect, useState } from "react";
import Chat from "./chat/Index";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import SearchResult from "./SearchResult";
import ChooseMembers from "./home-sidebar/ChooseMembers";
import GroupFinalization from "./home-sidebar/GroupFinalization";


export default observer(function HomeSidebar() {

    const {directStore: {searchChats, searchResults, chats}, groupStore: {editing, phase}} = useStore();
    const [searchVal, setSearchVal] = useState("");

    useEffect(() => {
        searchChats(searchVal);
    }, [searchVal, searchChats]);

    if(editing) {
        switch(phase) {
            case 0:
                return <ChooseMembers />;
            case 1:
                return <GroupFinalization />;
        }

    }

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