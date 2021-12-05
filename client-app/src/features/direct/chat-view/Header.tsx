import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";

export default observer(function Header() {

    const {directStore: {currentChat, channelInfos}} = useStore();    
    
    if(!currentChat)
        return null;

    return (
        <div className="chatHeader">
            {currentChat.type !== 2 || channelInfos.get(currentChat.id) ? (
            <>
            <div className="chatHeader__left">
                <div className="chatHeader__name">
                    {currentChat?.displayName}
                </div>
                <div className="chatHeader__status">
                    {currentChat.type === 2 ? `${channelInfos.get(currentChat.id)?.memberCount} ${channelInfos.get(currentChat.id)?.memberCount === 1 ? 'subscriber' : 'subscribers'}`  : "online"}
                </div>
            </div>
            <div className="chatHeader__right">
                <svg className="chatHeader__searchIco" width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1216 832q0-185-131.5-316.5t-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5 316.5-131.5 131.5-316.5zm512 832q0 52-38 90t-90 38q-54 0-90-38l-343-342q-179 124-399 124-143 0-273.5-55.5t-225-150-150-225-55.5-273.5 55.5-273.5 150-225 225-150 273.5-55.5 273.5 55.5 225 150 150 225 55.5 273.5q0 220-124 399l343 343q37 37 37 90z"/></svg>
                <svg className="chatHeader__ellipsisIco" width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1088 1248v192q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h192q40 0 68 28t28 68zm0-512v192q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h192q40 0 68 28t28 68zm0-512v192q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h192q40 0 68 28t28 68z"/></svg>
            </div>
            </>
            ) : <LoadingComponent />}
        </div>
    );
});