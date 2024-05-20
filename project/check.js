// Importing function changeColor from colors.js
import { changeColor } from "./colors.js";

// Importing constants for the detection of the exercises
import * as constants from './constants.js';

// Variable to control state of the exercises
let squatInProgress = false;
let shoulderRaiseInProgress = 0;
let BicepsInProgress = false;
let LegsInProgress = 0;
let PlankInProgress = false;
let BridgeInProgress = false;
let CrunchesInProgress = false;

// Function to check for squat exercise
function checkSquad (res) {
  let right_hip = res.landmarks[0][23]; 
  let right_knee = res.landmarks[0][25];
  let right_ankle = res.landmarks[0][27];

  let left_hip = res.landmarks[0][24]; 
  let left_knee = res.landmarks[0][26];
  let left_ankle = res.landmarks[0][28];

  let right_angle = computeAngle(right_hip, right_knee, right_ankle);
  let left_angle = computeAngle(left_hip, left_knee, left_ankle);

  // Check if the squat movement is in progress and the angles are within the specified range
  if (!squatInProgress && right_angle <= constants.SQUAT_ANGLE_START && left_angle <= constants.SQUAT_ANGLE_START) {
    squatInProgress = true; 
  }

  // Check if the squat movement is ending and the angles are within the specified range
  if (squatInProgress && right_angle >= constants.SQUAT_ANGLE_END && left_angle >= constants.SQUAT_ANGLE_END) {
    squatInProgress = false; 
    changeColor(0);
  }
}

// Function to check for shoulder raise exercise
function checkShoulderRaise(res) {
  let right_hip = res.landmarks[0][23];
  let right_shoulder = res.landmarks[0][11];
  let right_elbow = res.landmarks[0][13];

  let left_hip = res.landmarks[0][24];
  let left_shoulder = res.landmarks[0][12];
  let left_wlbow = res.landmarks[0][14];

  let right_shoulderAngle = computeAngle(right_hip, right_shoulder, right_elbow);
  let left_shoulderAngle = computeAngle(left_hip, left_shoulder, left_wlbow);

  // Check if the shoulder raise movement is starting and the angles are within the specified range
  if (right_shoulderAngle <= constants.SHOULDER_RAISE_ANGLE_START && left_shoulderAngle <= constants.SHOULDER_RAISE_ANGLE_START) {
    if (shoulderRaiseInProgress == 0) {
      shoulderRaiseInProgress = 1;
    } else if (shoulderRaiseInProgress == 2) {
      shoulderRaiseInProgress = 0;
      changeColor(5);
    }
  }

  // Check if the shoulder raise movement is ending and the angles are within the specified range
  if (shoulderRaiseInProgress == 1 && right_shoulderAngle >= constants.SHOULDER_RAISE_ANGLE_END && left_shoulderAngle >= constants.SHOULDER_RAISE_ANGLE_END) {
    shoulderRaiseInProgress = 2;
  } 
}

// Function to check for biceps curls exercise
function checkBicepsCurls (res) {
  let right_shoulder = res.landmarks[0][11]; 
  let right_elbow = res.landmarks[0][13];
  let right_wrist = res.landmarks[0][15];

  let left_shoulder = res.landmarks[0][12]; 
  let left_elbow = res.landmarks[0][14];
  let left_wrist = res.landmarks[0][16];

  let right_angle = computeAngle(right_shoulder, right_elbow, right_wrist);
  let left_angle = computeAngle(left_shoulder, left_elbow, left_wrist);

  // Check if the biceps curl movement is starting and the angles are within the specified range
  if (!BicepsInProgress && right_angle <= constants.BICEPS_ANGLE_START && left_angle <= constants.BICEPS_ANGLE_START) {
    BicepsInProgress = true; 
  }

  // Check if the biceps curl movement is ending and the angles are within the specified range
  if (BicepsInProgress && right_angle >= constants.BICEPS_ANGLE_END && left_angle >= constants.BICEPS_ANGLE_END) {
    BicepsInProgress = false; 
    changeColor(1);
  }
}

// Function to check for leg raises exercise
function checkLegRaises (res) {
  let right_shoulder = res.landmarks[0][11];
  let right_hip = res.landmarks[0][23];
  let right_knee = res.landmarks[0][25];

  let left_shoulder = res.landmarks[0][12];
  let left_hip = res.landmarks[0][24];
  let left_knee = res.landmarks[0][26];

  let right_Angle = computeAngle(right_shoulder, right_hip, right_knee);
  let left_Angle = computeAngle(left_shoulder, left_hip, left_knee);

  // Check if the leg raise movement is starting and the angles are within the specified range
  if (right_Angle >= constants.LEGS_ANGLE_START && left_Angle >= constants.LEGS_ANGLE_START) {
    if (LegsInProgress == 0) {
      LegsInProgress = 1;
    } else if (LegsInProgress == 2) {
      LegsInProgress = 0;
      changeColor(3);
    }
  }

  // Variable to know if the heel is higher than the hip
  let a = res.landmarks[0][23].y > res.landmarks[0][29].y;

  // Check if the leg raise movement is ending and the angles are within the specified range
  if (LegsInProgress == 1 && right_Angle <= constants.LEGS_ANGLE_END && left_Angle <= constants.LEGS_ANGLE_END && a) {
    LegsInProgress = 2;
  } 
}

// Function to check for plank exercise
function checkPlank (res) {
  let right_shoulder = res.landmarks[0][11];
  let right_hip = res.landmarks[0][23];
  let right_knee = res.landmarks[0][25];
  let right_elbow = res.landmarks[0][13];

  let left_shoulder = res.landmarks[0][12];
  let left_hip = res.landmarks[0][24];
  let left_knee = res.landmarks[0][26];
  let left_elbow = res.landmarks[0][14];

  let right_angle_1 = computeAngle(right_knee, right_hip, right_shoulder);
  let left_angle_1 = computeAngle(left_knee, left_hip, left_shoulder);

  let right_angle_2 = computeAngle(right_hip, right_shoulder, right_elbow);
  let left_angle_2 = computeAngle(left_hip, left_shoulder, left_elbow);

  // Check if the plank movement is starting and the angles are within the specified range
  if (!PlankInProgress && right_angle_1 >= constants.PLANK_ANGLE_LEGS && left_angle_1 >= constants.PLANK_ANGLE_LEGS && right_angle_2 >= constants.PLANK_ANGLE_ARMS 
        && left_angle_2 >= constants.PLANK_ANGLE_ARMS && right_angle_2 < constants.PLANK_ANGLE_ARMS_MAX && left_angle_2 < constants.PLANK_ANGLE_ARMS_MAX) {
  
    PlankInProgress = true;
    changeColor(6);

  // Check if the plank movement is ending and the angles are within the specified range
  } else if (PlankInProgress && ((right_angle_2 < constants.PLANK_ANGLE_ARMS && left_angle_2 < constants.PLANK_ANGLE_ARMS) 
            || (right_angle_2 > constants.PLANK_ANGLE_ARMS_MAX && left_angle_2 > constants.PLANK_ANGLE_ARMS_MAX))) {
    
    PlankInProgress = false;
    changeColor(6, true);
  } 
}

// Function to check for hip bridge exercise
function checkHipBridge (res) {
  let right_shoulder = res.landmarks[0][11];
  let right_hip = res.landmarks[0][23];
  let right_knee = res.landmarks[0][25];

  let left_shoulder = res.landmarks[0][12];
  let left_hip = res.landmarks[0][24];
  let left_knee = res.landmarks[0][26];

  let right_angle_1 = computeAngle(right_shoulder, right_hip, right_knee);
  let left_angle_1 = computeAngle(left_shoulder, left_hip, left_knee);

  // Variable to know if the knee is higher than the hip
  let a = res.landmarks[0][23].y > res.landmarks[0][25].y * 1.05; 

  // Check if the hip bridge movement is starting and the angles are within the specified range
  if (!BridgeInProgress && right_angle_1 >= constants.BRIDGE_ANGLE_UP && left_angle_1 >= constants.BRIDGE_ANGLE_UP && a) {
    BridgeInProgress = true;

  // Check if the hip bridge movement is ending and the angles are within the specified range
  } else if (BridgeInProgress && right_angle_1 < constants.BRIDGE_ANGLE_DOWN && left_angle_1 < constants.BRIDGE_ANGLE_DOWN){
    BridgeInProgress = false;
    changeColor(2);
  }
}

// Function to check for crunches exercise
function checkCrunches (res) {
  let right_shoulder = res.landmarks[0][11];
  let right_hip = res.landmarks[0][23];
  let right_knee = res.landmarks[0][25];

  let left_shoulder = res.landmarks[0][12];
  let left_hip = res.landmarks[0][24];
  let left_knee = res.landmarks[0][26];

  let right_angle_1 = computeAngle(right_shoulder, right_hip, right_knee);
  let left_angle_1 = computeAngle(left_shoulder, left_hip, left_knee);

  // Check if the crunches movement is starting and the angles are within the specified range
  if (!CrunchesInProgress && right_angle_1 < constants.CRUNCHES_ANGLE_UP && left_angle_1 < constants.CRUNCHES_ANGLE_UP) {
    CrunchesInProgress = true;
  // Check if the crunches movement is ending and the angles are within the specified range
  } else if (CrunchesInProgress && right_angle_1 > constants.CRUNCHES_ANGLE_DOWN && left_angle_1 > constants.CRUNCHES_ANGLE_DOWN){
    CrunchesInProgress = false;
    changeColor(4);
  }
}

// Function to compute the angle between three points
function computeAngle(a, b, c) {
  // Calculating the angle in radians using the arctangent function
  let radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);

  // Converting radians to degrees and taking the absolute value
  let angle = Math.abs(radians * 180.0 / Math.PI);

  // Adjusting angle to ensure it falls within the range [0, 360)
  return angle = (angle > 180) ? 360 - angle : angle;
}

// Funtion to know if you are standing or lying down
function checkStanding (res) {           // check if the nose is under the point the hip was at first
  return res.landmarks[0][0].y < hip;    // in that case is lying down
}

// Variable to store the height of the hip at the start of the training
let hip = 0;

// main function to call by createPoseLandmarker 
export function checkExercise (res) {
  // We only store hip value at first
  if (!hip) {
    hip = res.landmarks[0][23].y
  }

  if (checkStanding (res)) {  // If standing, up exercises are check
    checkSquad (res);
    checkBicepsCurls (res);
    checkShoulderRaise (res);
  } else {                    // If lying down, down exercises are check
    checkPlank (res);
    checkHipBridge (res);
    checkCrunches (res); 
    checkLegRaises (res);
  }
}