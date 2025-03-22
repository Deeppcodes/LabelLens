import React, { useRef } from 'react';
import Webcam from 'react-webcam';
import '../styles/WebcamCapture.css';

const WebcamCapture = ({ onCapture, onClose }) => {
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "environment"  // Use back camera on mobile devices
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  };

  return (
    <div className="webcam-container">
      <div className="webcam-overlay">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="webcam"
        />
        <div className="webcam-controls">
          <button className="capture-button" onClick={capture}>
            Take Photo
          </button>
          <button className="close-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebcamCapture;

