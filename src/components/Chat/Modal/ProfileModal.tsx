import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";

import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PermMediaIcon from '@mui/icons-material/PermMedia';

interface ProfileModalProps {
    isOpen: boolean,
    onClose: () => void,
    OnTakePhoto: () => void,
    onUploadPhoto: () => void,
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, OnTakePhoto, onUploadPhoto }) => {
    return (
        <Modal open={isOpen} onClose={onClose} aria-labelledby="profile-picture-modal-title"
            aria-describedby="profile-picture-modal-description">
            <Box className="profile-modal-container">
                <Button variant="text" color="primary" sx={{ textTransform: "none" }} onClick={OnTakePhoto}>
                    <Box className="button-icon-text">
                        <PhotoCameraIcon className="icon" />
                        <Typography variant="body1" className="button-text">
                            Take photo
                        </Typography>
                    </Box>
                </Button>
                <Button variant="text" color="primary" sx={{ textTransform: "none" }} onClick={onUploadPhoto}>
                    <Box className="button-icon-text">
                        <PermMediaIcon className="icon" />
                        <Typography variant="body1" className="button-text">
                            Upload photo
                        </Typography>
                    </Box>
                </Button>
                <Button variant="text" color="secondary" onClick={onClose}>
                    Close
                </Button>
            </Box>
        </Modal>
    )
}

export default ProfileModal;