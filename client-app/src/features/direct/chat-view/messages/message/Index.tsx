
import { useState } from "react";
import Text from "./text/Index";

interface Props {
    isMe: boolean;
    imgSrc: string;
    text: string;
    name: string;
    showImg: boolean;
    onRightClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function Message({isMe, imgSrc, text, name, showImg, onRightClick}: Props) {

    
    

    return (
        <>
        <div className="message" onContextMenu={onRightClick} >
            {(!isMe && showImg) && <img src={imgSrc} alt="user" className="message__img" />}
            <Text name={name} isMe={isMe} text={text} isDoubleTick={true} showImg={showImg}/>
        </div>
        
        </>
    );
}