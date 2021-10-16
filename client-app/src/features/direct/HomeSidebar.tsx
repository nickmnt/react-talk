import Actions from "./Actions";
import { useEffect, useState } from "react";
import Chat from "./chat/Index";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import SearchResult from "./SearchResult";


export default observer(function HomeSidebar() {

    const {directStore: {searchChats, searchResults}} = useStore();
    const [activeChat,setActiveChat] = useState("");
    const [searchVal, setSearchVal] = useState("");

    useEffect(() => {
        searchChats(searchVal);
    }, [searchVal, searchChats]);

    return (
        <div className="homeSidebar">
            <Actions searchVal={searchVal} setSearchVal={setSearchVal} />
            <div className="homeSidebar__chats"> 
                {!searchVal ? 
                <><Chat activeChat={activeChat} setActiveChat={setActiveChat} />
                <Chat activeChat={activeChat} setActiveChat={setActiveChat} />
                <Chat activeChat={activeChat} setActiveChat={setActiveChat} />
                <Chat activeChat={activeChat} setActiveChat={setActiveChat} />
                <Chat activeChat={activeChat} setActiveChat={setActiveChat} />
                <Chat activeChat={activeChat} setActiveChat={setActiveChat} />
                <Chat activeChat={activeChat} setActiveChat={setActiveChat} />
                <Chat activeChat={activeChat} setActiveChat={setActiveChat} />
                <Chat activeChat={activeChat} setActiveChat={setActiveChat} />
                <Chat activeChat={activeChat} setActiveChat={setActiveChat} />
                <Chat activeChat={activeChat} setActiveChat={setActiveChat} />
                <Chat activeChat={activeChat} setActiveChat={setActiveChat} />
                <Chat activeChat={activeChat} setActiveChat={setActiveChat} />
                <Chat activeChat={activeChat} setActiveChat={setActiveChat} />
                <Chat activeChat={activeChat} setActiveChat={setActiveChat} />
                <Chat activeChat={activeChat} setActiveChat={setActiveChat} />
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