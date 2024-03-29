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
        photoStore: { deletePhoto, setMain },
        userStore: { user }
    } = useStore();

    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (profilePicsOpen && profilePicsOpen.photos) {
            const mainIndex = profilePicsOpen.photos.findIndex((x) => x.isMain);
            setSelectedIndex(mainIndex);
        }
    }, [profilePicsOpen]);

    if (!profilePicsOpen || !profilePicsOpen.photos || !user || !(selectedIndex >= 0 && selectedIndex < profilePicsOpen.photos.length)) {
        return null;
    }

    const images: LboxImage[] = profilePicsOpen.photos.map((x) => {
        return { src: x.url };
    });

    const photo = profilePicsOpen.photos[selectedIndex];

    const handleDelete = () => {
        deletePhoto(photo);
    };

    const handleStar = () => {
        setMain(photo);
    };

    const headerElem = (
        <>
            {user.username === profilePicsOpen.username ? (
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
            <LightBox open={!!profilePicsOpen} onClose={() => setProfilePicsOpen(null)} images={images} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} headerElement={headerElem} />
        </div>
    );
});
