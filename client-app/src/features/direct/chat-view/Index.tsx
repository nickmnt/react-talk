import Header from "./Header";
import ChatInput from "./ChatInput";
import Messages from "./messages/Index";

export default function ChatView() {
    return (
        <div className="chatView">
            <Header />
            <Messages />
            <ChatInput />
        </div>
    );
}