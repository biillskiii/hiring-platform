"use client";

import {
  HandLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

export default class HandTracker {
  constructor(videoEl, canvasEl) {
    this.video = videoEl;
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext("2d");

    this.handLandmarker = null;
    this.running = false;

    this.onResults = () => {};
  }

  async init() {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      },
      runningMode: "VIDEO",
      numHands: 1,
    });
  }

  async start() {
    await this.init();
    this.running = true;

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.video.srcObject = stream;

    await this.video.play();

    const sync = () => {
      if (this.video.videoWidth > 0) {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
      }
    };

    sync();
    this.video.addEventListener("loadeddata", sync);
    this.video.addEventListener("loadedmetadata", sync);

    this.loop();
  }

  stop() {
    this.running = false;

    if (this.video?.srcObject) {
      this.video.srcObject.getTracks().forEach((t) => t.stop());
    }
  }

  loop = async () => {
    if (!this.running) return;

    if (
      this.canvas.width !== this.video.videoWidth &&
      this.video.videoWidth > 0
    ) {
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
    }

    const now = performance.now();
    const results = await this.handLandmarker.detectForVideo(this.video, now);

    this.draw(results);

    this.onResults({ landmarks: results.landmarks });

    requestAnimationFrame(this.loop);
  };

  draw(results) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!results.landmarks?.length) return;

    const utils = new DrawingUtils(this.ctx);

    results.landmarks.forEach((lm) => {
      utils.drawConnectors(lm, HandLandmarker.HAND_CONNECTIONS, {
        color: "white",
        lineWidth: 3,
      });
      utils.drawLandmarks(lm, { color: "black", radius: 4 });
    });
  }
}
