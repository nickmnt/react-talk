import Header from "./Header";
import ChatInput from "./ChatInput";
import Messages from "./messages/Index";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import ChatDetails from "./ChatDetails";

export default observer(function ChatView() {
    const {directStore: {currentChat}, chatStore: {stack}} = useStore();
    
    return (
        <div className="chatView">
            {currentChat ? 
            <><>
                <Header />
                <Messages />
                <ChatInput />
            </>
            {stack.map((elem, i) => <div key={i}>
                {elem.type === 0 && <ChatDetails chatPage={elem}/>}
                </div>
            )}
            </>:
            <>
                Select a chat to start messaging
            </>}
        </div>
    );
});