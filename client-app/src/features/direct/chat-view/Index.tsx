import Header from "./Header";
import ChatInput from "./ChatInput";
import Messages from "./messages/Index";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";

export default observer(function ChatView() {
    const {directStore: {currentChat}} = useStore();
    
    return (
        <div className="chatView">
            {currentChat ? 
            <>
                <Header />
                <Messages />
                <ChatInput />
            </>
            :
            <>
                Select a chat to start messaging
            </>}
        </div>
    );
});