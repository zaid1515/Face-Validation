import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import './CamPage.css';

const CamPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [validationPercentage, setValidationPercentage] = useState(0);
  const [time, setTime] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ]);
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              detectFace();
            };
          }
        })
        .catch(err => console.error(err));
    };

    const detectFace = async () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const displaySize = { width: video.videoWidth, height: video.videoHeight };

        faceapi.matchDimensions(canvas, displaySize);

        const intervalId = setInterval(async () => {
          const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
          if (detections.length > 0) {
            const expressions = detections[0].expressions;
            const maxExpression = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
            setValidationPercentage(expressions[maxExpression]);
            if (expressions[maxExpression] > 0.90) {
              setTime(prevTime => prevTime + 1);
              setTimerSeconds(prevSeconds => prevSeconds + 1);
            } else {
              setTime(0); // Reset time if expression confidence drops
              setTimerSeconds(0); // Reset timerSeconds
            }
          }
        }, 100);

        return () => clearInterval(intervalId); // Cleanup function to clear interval on component unmount
      }
    };

    loadModels().then(() => {
      startVideo();
    });

  }, []);

  useEffect(() => {
    if (time >= 50) {
      navigate('/home');
    }
  }, [time, navigate]);

  const faceVisibilityStyle = {
    color: validationPercentage >= 0.90 ? 'green' : 'red'
  };

  return (
    <div className="entrance-page">
  <div className="content">
    <h1>Welcome to the Online Hiring Test</h1>
    <p>Please ensure your webcam is ready.</p>
    <video id="video" className="webcam" autoPlay muted ref={videoRef}></video>
    <p className={`face-visibility ${validationPercentage >= 0.90 ? 'green' : 'red'}`}>
      Face Visibility: {validationPercentage >= 0.90 ? 'Visible' : 'Not Visible'}
    </p>
    <p className="validation-percentage">Face Validation Percentage: {Math.round(validationPercentage * 100)}%</p>
    <p className="seconds">Seconds with Face Validation ≥ 90: {parseInt(timerSeconds/10)}</p>
    <canvas className="overlay" ref={canvasRef} />
  </div>
</div>

  );
};

export default CamPage;
