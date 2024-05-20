// Importing necessary modules from MediaPipe CDN
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

// Importing function checkExercise from check.js
import { checkExercise } from './check.js'; 

// Variable to store the PoseLandmarker instance
let pose = 0;

// Function to create PoseLandmarker instance asynchronously
async function createPoseLandmarker() {
  // Resolve vision task files using FilesetResolver
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );
  
  // Create PoseLandmarker instance with custom options
  pose = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      // Path to the PoseLandmarker model asset
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task`,
      delegate: "GPU", // Use GPU for acceleration
    },
    runningMode: "VIDEO", // Running mode set to VIDEO
    numPoses: 2, // Number of poses to detect
  });
}

// Getting Video elements
const videoInput = document.getElementById("videoInput");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const inputContainers = document.querySelectorAll('.input-container');

// Event listener for loaded metadata of the video to adjust canvas dimensions
video.addEventListener("loadedmetadata", () => {
  const videoRatio = video.videoWidth / video.videoHeight;
  canvas.width = video.clientWidth;
  canvas.height = canvas.width / videoRatio;
});

// Function to start pose detection
async function startDetection() {
  if (pose && video.readyState >= 3) {
    const videoRatio = video.videoWidth / video.videoHeight;
    const canvasRatio = canvas.width / canvas.height;

    let drawWidth, drawHeight;

    // Adjusting dimensions to maintain correct aspect ratio
    if (canvasRatio > videoRatio) {
      drawHeight = canvas.height;
      drawWidth = videoRatio * canvas.height;
    } else {
      drawWidth = canvas.width;
      drawHeight = canvas.width / videoRatio;
    }

    const x = (canvas.width - drawWidth) / 2;
    const y = (canvas.height - drawHeight) / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const currentTimeInSeconds = Date.now() / 1000;

    try {
      // Detecting poses in the video
      const poseResult = await pose.detectForVideo(video, currentTimeInSeconds);

      // Checking if landmarks exist before accessing
      if (poseResult.landmarks && poseResult.landmarks.length > 0) {

        checkExercise(poseResult); // Checking exercise with detected landmarks

        // Drawing the video while maintaining aspect ratio and centered
        context.drawImage(video, x, y, drawWidth, drawHeight);

        const drawingUtils = new DrawingUtils(context); // Drawing utilities

        // Drawing all landmarks and their connections
        for (const landmarks of poseResult.landmarks) {
          drawingUtils.drawLandmarks(landmarks); // Drawing landmarks
          drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS); // Drawing connections between landmarks
        }
      }
    } catch (error) {} 
  }

  // If the video is not finished keep calling the function
  if (!video.paused && !video.ended) {
    window.requestAnimationFrame(startDetection);
  }
}

// Event listener for change in the video input
videoInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    video.src = URL.createObjectURL(file); // Setting video source to the selected file
    video.muted = true; // Muting the video for autoplay

    // Hide both input containers
    inputContainers.forEach(container => {
      container.classList.add('hidden');
    });

    await createPoseLandmarker(); // Creating the PoseLandmarker
    video.play(); // Playing the video
    video.addEventListener("playing", startDetection); // Starting pose detection when the video is playing
  }
});

document.getElementById("cameraButton").addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream; // Setting the video source to the camera stream

    // Hide both input containers
    inputContainers.forEach(container => {
      container.classList.add('hidden');
    });

    await video.play(); // Ensuring the video starts playing automatically
    await createPoseLandmarker(); // Creating the PoseLandmarker
    startDetection(); // Starting pose detection

  } catch (error) {
    console.error('Error trying to use the camera: ', error); // Logging any errors that occur while trying to access the camera
  }
});
