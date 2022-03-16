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
        directStore: { profilePicsOpen, setProfilePicsOpen },
        settingsStore: { profile },
        photoStore: { deletePhoto, setMain }
    } = useStore();

    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (true && profile && profile.photos) {
            const mainIndex = profile?.photos.findIndex((x) => x.isMain);
            setSelectedIndex(mainIndex);
        }
    }, [profilePicsOpen, profile]);

    if (!profile || !profile.photos) {
        return null;
    }

    const images: LboxImage[] = profile.photos.map((x) => {
        return { src: x.url };
    });

    const photo = profile.photos[selectedIndex];

    const handleDelete = () => {
        deletePhoto(photo);
    };

    const handleStar = () => {
        setMain(photo);
    };

    const headerElem = (
        <>
            <IconButton sx={{ color: 'white' }} onClick={handleDelete}>
                <DeleteOutlinedIcon />
            </IconButton>
            <IconButton sx={{ color: 'white' }} onClick={handleStar}>
                {photo.isMain ? <StarIcon /> : <StarOutlineIcon />}
            </IconButton>
        </>
    );

    return (
        <div style={{ zIndex: 1301 }}>
            <LightBox open={profilePicsOpen} onClose={() => setProfilePicsOpen(false)} images={images} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} headerElement={headerElem} />
        </div>
    );
});
