import { observer } from "mobx-react-lite";
import { useStore } from "../../../../app/stores/store";
import Message from "./message/Index";

export default observer(function Messages() {

    const {directStore: {currentChat}, userStore: {user}} = useStore();

    return (
        <div className="messages">
            {(currentChat?.type === 'privateChat' || currentChat?.type === 'localPrivate') && user && 
            
            currentChat.privateChat?.messages.map((message, i) => 
            <div className="messages__message">
                <Message name="Name" isMe={user.username === message.username} showImg={false} imgSrc={'/assets/user.png'} text={message.body} key={i} />
            </div>)}
            <div className="messages__message">
                <Message name="Name" isMe={false} showImg={true} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
            </div>
            <div className="messages__message">
                <Message name="Name" isMe={false} showImg={false} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
            </div>
            <div className="messages__message">
                <Message name="Name" isMe={true} showImg={false} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
            </div>

            <div className="messages__message">
                <Message name="Name" isMe={false} showImg={true} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
            </div>
            <div className="messages__message">
                <Message name="Name" isMe={false} showImg={false} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
            </div>
            <div className="messages__message">
                <Message name="Name" isMe={true} showImg={false} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
            </div>

            <div className="messages__message">
                <Message name="Name" isMe={false} showImg={true} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
            </div>
            <div className="messages__message">
                <Message name="Name" isMe={false} showImg={false} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
            </div>
            <div className="messages__message">
                <Message name="Name" isMe={true} showImg={false} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
            </div>

            <div className="messages__message">
                <Message name="Name" isMe={false} showImg={true} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
            </div>
            <div className="messages__message">
                <Message name="Name" isMe={false} showImg={false} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
            </div>
            <div className="messages__message">
                <Message name="Name" isMe={true} showImg={false} imgSrc={'/assets/user.png'} text="abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg...abcdefg..." />
            </div>
        </div>
    );
});