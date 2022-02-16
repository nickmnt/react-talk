import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import CopyDialog from '../../app/common/dialog/CopyDialog';
import { useStore } from '../../app/stores/store';
import ChatView from './chat-view/Index';
import HomeSidebar from './HomeSidebar';
import BioDialog from './settings/BioDialog';
import NameDialog from './settings/NameDialog';
import PhotoDialog from './settings/PhotoDialog';
import SettingsDialog from './settings/SettingsDialog';

export default observer(function Inbox() {
    const expanded = false;

    const {
        directStore: { createHubConnection, clearChats, chats, currentChat, settingsOpen, setSettingsOpen, nameOpen, setNameOpen, bioOpen, setBioOpen, copyOpen, setCopyOpen, copyFunc },
        photoStore: { photoOpen, setPhotoOpen }
    } = useStore();

    useEffect(() => {}, [chats]);

    useEffect(() => {
        createHubConnection();

        return () => {
            clearChats();
        };
    }, [createHubConnection, clearChats]);

    return (
        <div className="home">
            <div className={`home__container ${expanded && 'home__container--expanded'}`}>
                <div className={`home__main ${currentChat && 'home__main--active'}`}>
                    <ChatView />
                </div>
                <div className={`home__sidebar ${currentChat && 'home__sidebar--inactive'}`}>
                    <HomeSidebar />
                </div>
            </div>
            <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
            <PhotoDialog open={photoOpen} onClose={() => setPhotoOpen(false)} />
            <NameDialog open={nameOpen} onClose={() => setNameOpen(false)} />
            <BioDialog open={bioOpen} onClose={() => setBioOpen(false)} />
            <CopyDialog open={copyOpen} onClose={() => setCopyOpen(false)} onCopy={copyFunc} />
        </div>
    );
});
