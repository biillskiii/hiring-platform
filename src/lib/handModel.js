// lib/handModel.js
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let landmarker = null;
let vision = null;

export async function getHandLandmarker() {
  if (landmarker) return landmarker;

  if (!vision) {
    vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
  }

  // sesuai DOCUMENTATION
  landmarker = await HandLandmarker.createFromModelPath(
    vision,
    "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
  );

  return landmarker;
}
