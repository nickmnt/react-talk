import Actions from "./Actions";
import { useState } from "react";
import Chat from "./chat/Index";


export default function HomeSidebar() {

    const [activeChat,setActiveChat] = useState("");
    const [searchVal, setSearchVal] = useState("");

    return (
        <div className="homeSidebar">
            <Actions searchVal={searchVal} setSearchVal={setSearchVal} />
            <div className="homeSidebar__chats"> 
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
            </div>
            
        </div>
    );
}