import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef } from "react";
import { SearchChatDto } from '../../app/models/chat';

interface Props {
    searchResult: SearchChatDto;
}

export default function Chat({searchResult}: Props) {

    return (
        <div className="chat">
            <div className={`chat__container`}>
                <div className="chat__left">
                    <img src={searchResult.image || "/assets/user.png"} alt="User" className="chat__img" />
                </div>
                <div className="chat__right">
                    <div className="chat__rightTop">
                        <div className="chat__name">{searchResult.displayName}</div>
                    </div>
                    <div className="chat__rightBottom">
                        <div className="last-msg">
                            @{searchResult.username}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}