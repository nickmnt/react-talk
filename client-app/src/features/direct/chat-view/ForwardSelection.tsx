import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper/Paper";
import ForwardHeader from "./ForwardHeader";
import { useStore } from "../../../app/stores/store";
import Chat from "../chat/Index";
import { ChatDto } from "../../../app/models/chat";
import ForwardInput from "./ForwardInput";

export interface Props {
  onClose: () => void;
}

export default observer(function ForwardSelection({onClose}: Props) {
  const {
    directStore: { chats },
  } = useStore();

  const [selected, setSelected] = useState<ChatDto[]>([]);

  return (
    <Paper square className="homeSidebar" elevation={2} sx={{display: 'flex', flexDirection: 'column', width: '35rem', height: '50rem'}}>
      <ForwardHeader onClose={onClose} />
      <div className="homeSidebar__chats" style={{height: 'auto', flex: '1'}}>
        <List disablePadding>
          {chats.map((chat) => (
            <Chat chat={chat} key={chat.id} forwarding selected={selected} setSelected={setSelected}/>
          ))}
        </List>
      </div>
      {selected.length > 0 && <ForwardInput />}
    </Paper>
  );
});
