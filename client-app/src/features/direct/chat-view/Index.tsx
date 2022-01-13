import Header from "./Header";
import ChatInput from "./ChatInput";
import Messages from "./messages/Index";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import ChatDetails from "./ChatDetails";
import AddMember from "./AddMember";
import MemberPermissions from "./MemberPermissions";
import GroupEdit from "./GroupEdit";
import MemberPermissionsAll from "./MemberPermissionsAll";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default observer(function ChatView() {
  const {
    directStore: { currentChat, loadingChatDetails },
    chatStore: { stack },
  } = useStore();

  return (
    <div className="chatView">
      {currentChat ? (
        <>
            {loadingChatDetails ? <LoadingComponent/> :
          <>
            <Header />
            <Messages />
            <ChatInput />
          </>
            }
          {stack.map((elem, i) => (
            <div key={i}>
              {elem.type === 0 && <ChatDetails chatPage={elem} />}
              {elem.type === 1 && <ChatDetails chatPage={elem} />}
              {elem.type === 2 && <ChatDetails chatPage={elem} />}
              {elem.type === 20 && <AddMember chatPage={elem} />}
              {elem.type === 21 && <AddMember chatPage={elem} />}
              {elem.type === 30 && (
                <MemberPermissions chatPage={elem} member={elem.member!} />
              )}
              {elem.type === 40 && (
                <GroupEdit chatPage={elem} chat={elem.groupData!} />
              )}
              {elem.type === 50 && (
                <MemberPermissionsAll chatPage={elem} chat={elem.groupData!} />
              )}
            </div>
          ))}
        </>
      ) : (
        <>Select a chat to start messaging</>
      )}
    </div>
  );
});
