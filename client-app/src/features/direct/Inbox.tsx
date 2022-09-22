import Paper from '@mui/material/Paper/Paper';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CopyDialog from '../../app/common/dialog/CopyDialog';
import { useStore } from '../../app/stores/store';
import ContactsDialog from '../contacts/ContactsDialog';
import ChatView from './chat-view/Index';
import LightboxWrapper from './chat-view/messages/LightboxWrapper';
import HomeSidebar from './HomeSidebar';
import LightboxWrapperGroup from './lightbox/LightboxWrapperGroup';
import LightboxWrapperProfile from './lightbox/LightboxWrapperProfile';
import NotificationHandler from './notifications/NotificationHandler';
import BioDialog from './settings/BioDialog';
import NameDialog from './settings/NameDialog';
import PhotoDialog from './settings/PhotoDialog';
import SettingsDialog from './settings/SettingsDialog';

export default observer(function Inbox() {
    const {
        directStore: {
            createHubConnection,
            clearChats,
            currentChat,
            settingsOpen,
            setSettingsOpen,
            nameOpen,
            setNameOpen,
            bioOpen,
            setBioOpen,
            copyOpen,
            setCopyOpen,
            copyFunc,
            contactsOpen,
            setContactsOpen,
            getChat,
            clearCurrentChat
        },
        photoStore: { photoOpen, setPhotoOpen },
        contactsStore: { loadFollowings }
    } = useStore();

    let { chatId } = useParams();

    useEffect(() => {
        loadFollowings();
    }, [loadFollowings]);

    useEffect(() => {
        createHubConnection();

        return () => {
            clearChats();
        };
    }, [createHubConnection, clearChats]);

    useEffect(() => {
        clearCurrentChat(!!chatId);
        if (chatId) getChat(chatId);
    }, [chatId, clearCurrentChat, getChat]);

    return (
        <div className="home">
            <div className="home__container">
                <div className={`home__main ${currentChat && 'home__main--active'}`}>
                    <ChatView />
                </div>
                <Paper className={`home__sidebar ${currentChat && 'home__sidebar--inactive'}`} square>
                    <HomeSidebar />
                </Paper>
            </div>
            <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
            <PhotoDialog open={photoOpen} onClose={() => setPhotoOpen(false)} />
            <NameDialog open={nameOpen} onClose={() => setNameOpen(false)} />
            <BioDialog open={bioOpen} onClose={() => setBioOpen(false)} />
            <CopyDialog open={copyOpen} onClose={() => setCopyOpen(false)} onCopy={copyFunc} />
            <ContactsDialog open={contactsOpen} onClose={() => setContactsOpen(false)} />
            <LightboxWrapper />
            <LightboxWrapperProfile />
            <LightboxWrapperGroup />
            <NotificationHandler />
        </div>
    );
});
