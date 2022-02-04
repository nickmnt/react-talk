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
import Paper from "@mui/material/Paper/Paper";
import ChatIcon from '@mui/icons-material/Chat';
import { Message } from "../../../app/models/chat";
import SelectHeader from "./SelectHeader";
import { toast } from "react-toastify";
import ForwardDialog from "./ForwardDialog";

export default observer(function ChatView() {
  const {
    directStore: { currentChat, loadingChatDetails,selected, setSelected, forwarding, setForwarding },
    chatStore: { stack },
  } = useStore();
  
  const toggleSelected = (message: Message) => {
    const msg = selected.find(x => x.id === message.id)!!;
    if(msg) {
      setSelected(selected.filter(x => x.id !== message.id));
    } else {
      setSelected([...selected, message]);
    }
  }

  const clearSelected = () => {
    setSelected([]);
  }

  const copyMessages = () => {
    const sorted = selected.sort((x,y) => x.createdAt.getTime() - y.createdAt.getTime());
    let result = '';
    sorted.forEach((x) => {
      result = result + x.displayName + ':\n';
      result = result + x.body;
      result = result + '\n';
    });
    result = result.replace(/\n*$/, "");
    navigator.clipboard.writeText(result);
    toast('Copied text to clipboard', {type: 'success'});
    setSelected([]);
  }
  
  return (
    <div className="chatView">
      {currentChat ? (
        <>
            {loadingChatDetails ? <LoadingComponent/> :
          <>
            {selected.length === 0 ? <Header />
            : <SelectHeader count={selected.length} clearSelected={clearSelected} copyMessages={copyMessages} />}
            <Messages selected={selected} toggleSelected={toggleSelected} />
            <ChatInput selectedCount={selected.length} />
          </>
            }
          <div style={{zIndex: 1000}}>{stack.map((elem, i) => (
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
          </div>
        </>
      ) : (
        <div className="chatView__welcome">
          <Paper className="chatView__welcomeContainer" elevation={5}>
            <ChatIcon sx ={{width: 100, height: 100, marginBottom: '2.5rem'}}/>
            Select a chat to start messaging
          </Paper>
        </div>
      )}
      <ForwardDialog open={selected.length > 0 && forwarding} onClose={() => setForwarding(false)}/>
    </div>
  );
});
