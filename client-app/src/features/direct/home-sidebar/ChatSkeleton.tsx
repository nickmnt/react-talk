import ListItemButton from "@mui/material/ListItemButton/ListItemButton";
import Skeleton from "@mui/material/Skeleton/Skeleton";
import React from "react";

export default function ChatSkeleton() {
  return (
    <ListItemButton className={`chat__container`}>
      <Skeleton variant="circular" width={40} height={40} />
      <div className="chat__right" style={{marginLeft: '1rem'}}>
        <div className="chat__rightTop">
          <div className="chat__name">
              <Skeleton variant="text" width={50} height={16} />
          </div>

          <div>
            <Skeleton variant="text" width={50} height={16} />
          </div>
        </div>
        <div className="chat__rightBottom">
          <div className="last-msg">
              <Skeleton variant="text" width={150} height={16} />
          </div>
          <Skeleton variant="circular" width={16} height={16}/>
          {/* <Skeleton variant="text" className="chat__badge" /> */}
        </div>
      </div>
    </ListItemButton>
  );
}
