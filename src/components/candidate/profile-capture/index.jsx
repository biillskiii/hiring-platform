"use client";

import React, { useEffect, useRef, useState } from "react";
import HandTracker from "@/lib/handTracker";
import { silenceMediapipeLogs } from "@/lib/hooks/silenceMediapipeLogs ";
import Header from "./header";
import PoseGuide from "./pose-guide";
import { Countdown } from "./countdown";

export default function GestureCaptureModal({
  isOpen,
  onClose,
  onPhotoCapture,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const trackerRef = useRef(null);
  const countdownRef = useRef(null);

  const [currentPose, setCurrentPose] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [poseDone, setPoseDone] = useState({ 1: false, 2: false, 3: false });

  useEffect(() => silenceMediapipeLogs(), []);

  const getFingerStates = (lm) => {
    const index = lm[8].y < lm[6].y;
    const middle = lm[12].y < lm[10].y;
    const ring = lm[16].y < lm[14].y;
    const pinky = lm[20].y < lm[18].y;
    const thumb = lm[4].x > lm[3].x;
    return { index, middle, ring, pinky, thumb };
  };

  const detectPose = ({ index, middle, ring, pinky, thumb }) => {
    if (thumb) return 0;
    if (index && !middle && !ring && !pinky) return 1;
    if (index && middle && !ring && !pinky) return 2;
    if (index && middle && ring && !pinky) return 3;
    return 0;
  };

  // ====================================
  // COUNTDOWN → FOTO → CLOSE MODAL
  // ====================================
  const startCountdown = () => {
    let t = 3;

    setCountdown(t);
    countdownRef.current = t;

    const iv = setInterval(() => {
      t--;
      setCountdown(t);
      countdownRef.current = t;

      if (t === 0) {
        clearInterval(iv);
        setCountdown(null);

        trackerRef.current?.stop();
        takePhoto(); // → AUTO CLOSE
      }
    }, 1000);
  };

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg");

    onPhotoCapture(dataUrl);
    onClose(); // langsung tutup modal
  };

  // ====================================
  // TRACKING
  // ====================================
  const trackerRefResults = ({ landmarks }) => {
    if (!landmarks?.length) return;

    const fingers = getFingerStates(landmarks[0]);
    const pose = detectPose(fingers);

    setCurrentPose(pose);

    setPoseDone((prev) => {
      const updated = { ...prev };

      if (pose === 1 && !prev[1]) updated[1] = true;
      if (pose === 2 && prev[1] && !prev[2]) updated[2] = true;

      if (pose === 3 && prev[1] && prev[2] && !prev[3]) {
        updated[3] = true;

        if (countdownRef.current === null) startCountdown();
      }

      return updated;
    });
  };

  // ====================================
  // START TRACKER
  // ====================================
  useEffect(() => {
    if (!isOpen) return;

    setCountdown(null);
    countdownRef.current = null;
    setCurrentPose(0);
    setPoseDone({ 1: false, 2: false, 3: false });

    const wait = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      clearInterval(wait);

      const tracker = new HandTracker(video, canvas);
      trackerRef.current = tracker;
      tracker.onResults = trackerRefResults;
      tracker.start();
    }, 50);

    return () => {
      clearInterval(wait);
      trackerRef.current?.stop();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white w-[760px] rounded-xl p-6 relative">
        <Header onClose={onClose} />

        <div className="relative mt-4">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full rounded-lg"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {countdown !== null && <Countdown value={countdown} />}
        </div>

        <PoseGuide poseDone={poseDone} />
      </div>
    </div>
  );
}
