import React from "react";
import { observer } from "mobx-react-lite";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper/Paper";
import ForwardHeader from "./ForwardHeader";
import { useStore } from "../../../app/stores/store";
import Chat from "../chat/Index";

export default observer(function ForwardSelection() {
  const {
    directStore: { chats },
  } = useStore();

  return (
    <Paper square className="homeSidebar" elevation={2}>
      <ForwardHeader />
      <div className="homeSidebar__chats">
        <List disablePadding>
          {chats.map((chat) => (
            <Chat chat={chat} key={chat.id} neverSelected />
          ))}
        </List>
      </div>
    </Paper>
  );
});
