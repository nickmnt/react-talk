import { observer } from 'mobx-react-lite';
import { LboxImage, LightBox } from 'r-lightbox';
import { useEffect, useState } from 'react';
import { useStore } from '../../../app/stores/store';
import IconButton from '@mui/material/IconButton/IconButton';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';

export default observer(function LightboxWrapperProfile() {
    const {
        directStore: { groupPicsOpen, setGroupPicsOpen },
        photoStore: { deletePhotoGroup, setMainGroup },
        userStore: { user }
    } = useStore();

    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (groupPicsOpen && groupPicsOpen.groupChat && groupPicsOpen.groupChat.photos) {
            const mainIndex = groupPicsOpen.groupChat.photos.findIndex((x) => x.isMain);
            setSelectedIndex(mainIndex);
        }
    }, [groupPicsOpen]);

    if (!groupPicsOpen || !groupPicsOpen.groupChat || !groupPicsOpen.groupChat.photos || !user || !(selectedIndex >= 0 && selectedIndex < groupPicsOpen.groupChat.photos.length)) {
        return null;
    }

    const images: LboxImage[] = groupPicsOpen.groupChat.photos.map((x) => {
        return { src: x.url };
    });

    const photo = groupPicsOpen.groupChat.photos[selectedIndex];

    const handleDelete = () => {
        deletePhotoGroup(photo, groupPicsOpen.id);
    };

    const handleStar = () => {
        setMainGroup(photo, groupPicsOpen.id);
    };

    const headerElem = (
        <>
            {!!groupPicsOpen.groupChat.members.find((x) => x.username === user.username) && groupPicsOpen.groupChat.changeChatInfo && groupPicsOpen.groupChat.changeChatInfoAll ? (
                <>
                    <IconButton sx={{ color: 'white' }} onClick={handleDelete}>
                        <DeleteOutlinedIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'white' }} onClick={handleStar}>
                        {photo.isMain ? <StarIcon /> : <StarOutlineIcon />}
                    </IconButton>
                </>
            ) : (
                <>{photo.isMain && <IconButton sx={{ color: 'white' }}>{photo.isMain && <StarIcon />}</IconButton>}</>
            )}
        </>
    );

    return (
        <div style={{ zIndex: 1301 }}>
            <LightBox open={!!groupPicsOpen} onClose={() => setGroupPicsOpen(null)} images={images} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} headerElement={headerElem} />
        </div>
    );
});
