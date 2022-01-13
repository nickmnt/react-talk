import { observer } from "mobx-react-lite";
import { SearchChatDto } from "../../app/models/chat";
import { useStore } from "../../app/stores/store";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

interface Props {
  searchResult: SearchChatDto;
}

export default observer(function SearchResult({ searchResult }: Props) {
  const {
    directStore: { setLocalChat },
  } = useStore();

  return (
    <ListItemButton
      className={`chat__container`}
      onClick={() =>
        setLocalChat(
          searchResult.username,
          searchResult.displayName,
          searchResult.image
        )
      }
    >
      <ListItemAvatar>
        <Avatar
          alt={searchResult.displayName}
          src={searchResult.image}
          sx={{ width: 48, height: 48 }}
        />
      </ListItemAvatar>
      <div className="chat__right">
        <div className="chat__rightTop">
          <div className="chat__name">{searchResult.displayName}</div>
        </div>
      </div>
    </ListItemButton>
  );
});