import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import React, { useRef, useState } from "react";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { dataURLToBlob } from "../../../helpers/utils/dataURLToBlob";
import ProfileService from "../../../services/ProfileService";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  OnTakePhoto: () => void;
  onUploadPhoto: () => void;
  onImageUpload: (url: string) => void;
  onImageDelete: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onUploadPhoto,
  onImageUpload,
  onImageDelete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isEnableTakePhoto, setEnableTakePhoto] = useState(false);

  const auth = useSelector((state: RootState) => state.auth.auth);

  const startCamera = async () => {
    try {
      setEnableTakePhoto(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const dataUrl = canvasRef.current.toDataURL("image/png");

        setCapturedImage(dataUrl);
        stopCamera();
        setEnableTakePhoto(false);

        // Convert base64 to Blob
        const blob = dataURLToBlob(dataUrl);
        uploadImage(blob);
      }
    }
  };

  const stopCamera = () => {
    setIsCameraActive(false);
    setCapturedImage(null);

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const uploadImage = async (image: Blob) => {
    if (auth && auth.token && auth.user) {
      const response = await ProfileService.updateProfileImage(
        auth.token,
        auth.user?.id,
        image
      );
      const data = response.response;
      const imageURL = data.imageUrl;

      // Pass the image URL to the parent component
      onImageUpload(imageURL);
    }
  };

  const removeImage = async () => {
    if (auth && auth.token && auth.user) {
      const response = await ProfileService.removeProfileImage(
        auth.token,
        auth.user?.id
      );
      console.log(response);

      // Pass the image URL to the parent component
      onImageDelete();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        stopCamera();
        onClose();
      }}
      aria-labelledby="profile-picture-modal-title"
      aria-describedby="profile-picture-modal-description"
    >
      <Box className="profile-modal-container">
        {/* Video element to show live camera feed */}
        {isEnableTakePhoto && (
          <video ref={videoRef} style={{ width: "100%", height: "auto" }} />
        )}

        {/* Canvas element for capturing the photo */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Display captured image */}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            style={{ width: "100%", height: "auto" }}
          />
        )}

        {!isCameraActive && !capturedImage && (
          <>
            <Button
              variant="text"
              color="primary"
              sx={{ textTransform: "none" }}
              onClick={startCamera}
            >
              <Box className="button-icon-text">
                <PhotoCameraIcon className="icon" />
                <Typography variant="body1" className="button-text">
                  Take photo
                </Typography>
              </Box>
            </Button>
            <Button
              variant="text"
              color="primary"
              sx={{ textTransform: "none" }}
              onClick={onUploadPhoto}
            >
              <Box className="button-icon-text">
                <PermMediaIcon className="icon" />
                <Typography variant="body1" className="button-text">
                  Upload photo
                </Typography>
              </Box>
            </Button>

            {auth.user?.profileImage && (
              <>
                {/* Horizontal line between the buttons */}
                <Divider sx={{ my: 1 }} />

                <Button
                  variant="text"
                  color="primary"
                  sx={{ textTransform: "none" }}
                  onClick={removeImage}
                >
                  <Box className="button-icon-text">
                    <DeleteIcon className="icon" />
                    <Typography variant="body1" className="button-text">
                      Remove photo
                    </Typography>
                  </Box>
                </Button>
              </>
            )}

            <Divider sx={{ my: 1 }} />
          </>
        )}

        {isCameraActive && (
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={capturePhoto}
              sx={{ marginTop: "16px" }}
            >
              Capture Photo
            </Button>
          </Box>
        )}

        {capturedImage && (
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setCapturedImage(null);
                startCamera();
              }}
              sx={{ marginTop: "16px" }}
            >
              Retake Photo
            </Button>
          </Box>
        )}

        <Button
          variant="text"
          color="secondary"
          onClick={() => {
            stopCamera();
            onClose();
          }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ProfileModal;
