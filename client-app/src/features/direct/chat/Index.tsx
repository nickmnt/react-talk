import LastMsg from "./LastMsg";
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef } from "react";

interface Props {
    activeChat: string;
    setActiveChat: (val: string) => void;
}

export default function Chat({activeChat,setActiveChat}: Props) {

    let dummyId = useRef<string>();

    useEffect(() => {
        dummyId.current = uuidv4();
    }, []);

    return (
        <div className="chat">
            <div className={`chat__container ${activeChat===dummyId.current && "chat__container--active"}`} onClick={()=>setActiveChat(dummyId.current!)}>
                <div className="chat__left">
                    <img src="/assets/user.png" alt="User" className="chat__img" />
                </div>
                <div className="chat__right">
                    <div className="chat__rightTop">
                        <div className="chat__name">Name</div>
                        <div className={`chat__date ${activeChat===dummyId.current && "chat__date--active"}`}>10:20 PM</div>
                    </div>
                    <div className="chat__rightBottom">
                        <LastMsg />
                        {activeChat !== dummyId.current && <div className="chat__badge">1696</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}