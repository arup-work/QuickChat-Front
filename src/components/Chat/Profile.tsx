import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CreateIcon from "@mui/icons-material/Create";
import DoneIcon from "@mui/icons-material/Done";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useSelector } from "react-redux";

import { RootState } from "../../redux";
import ProfileService from "../../services/ProfileService";
import { showSuccessToast } from "../../helpers/utils/toastUtils";
import { ToastContainer } from "react-toastify";
import ProfileModal from "./Modal/ProfileModal";

interface ProfileProps {
  handleMenuClick: (menu: string) => void; // Define the function type properly
}

const Profile: React.FC<ProfileProps> = ({ handleMenuClick }) => {
  const auth = useSelector((state: RootState) => state.auth.auth);
  const [isNameEditable, setIsEditable] = useState(false);
  const [profileName, setProfileName] = useState(auth.user?.name || "");
  const [isModalOpen, setModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleProfileNameSave = async () => {
    setIsEditable(false);
    await ProfileService.updateProfileName(auth.token || '', auth.user?.id || '', profileName);
    showSuccessToast('Your name changed.');
  };

  const handleTakePhoto = () => {
    console.log("Take Photo Clicked");
    setModalOpen(false);
  }

  const handleUploadPhoto = () => {
    console.log("Upload photo clicked");
    setModalOpen(false);
  }

  const toggleModal = (open: boolean) => {
    setModalOpen(open);
  }

  return (
    <>
      <Box className="sidebar__settings">
        <ToastContainer />
        <Typography variant="h6" className="sidebar__settings-title">
          <Box
            component="span"
            className="sidebar__settings-back-icon"
            onClick={() => handleMenuClick("settings")}
          >
            <ArrowBackIcon />
          </Box>
          <span className="sidebar__settings-text">Profile</span>
        </Typography>
        <Box className="sidebar__settings-profile-picture" onClick={() => toggleModal(true)}>
          <img
            src="/src/assets/default-profile.png" /* Replace with your default image path */
            alt="Profile"
            className="sidebar__settings-profile-picture-img"
          />
          <div className="sidebar__settings-profile-hover">
            <Box className="sidebar__settings-profile-hover-content">
              <CameraAltIcon className="sidebar__settings-profile-hover-icon" />
              <Box className="sidebar__settings-profile-hover-text">
                {auth.user?.file_path ? 'Change profile picture' : 'Upload profile picture'}
              </Box>
            </Box>
          </div>
        </Box>
        <Box className="sidebar__settings-profile-container">
          <Typography
            variant="body2"
            className="sidebar__settings-profile-heading"
          >
            Your name
          </Typography>
          <Box className="sidebar__settings-profile-name">
            {!isNameEditable ? (
              <>
                <span className="sidebar__settings-profile-name-text">
                  {profileName}
                </span>
                <CreateIcon
                  className="sidebar__settings-profile-icon"
                  onClick={handleEditClick}
                />
              </>
            ) : (
              <Box className="sidebar__settings-profile-edit-container">
                <Box className="sidebar__settings-profile-input">
                  <textarea
                    className="sidebar__settings-profile-name-textarea"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />
                  <DoneIcon
                    className="sidebar__settings-profile-done-icon"
                    onClick={handleProfileNameSave}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Profile modal */}
      <ProfileModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} OnTakePhoto={handleTakePhoto} onUploadPhoto={handleUploadPhoto} />
    </>
  );
};

export default Profile;
