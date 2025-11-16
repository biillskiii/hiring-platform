export function silenceMediapipeLogs() {
  if (typeof window === "undefined") return;

  const info = console.info;

  console.info = (...args) => {
    const msg = String(args[0]);

    // blok log Mediapipe yg ganggu
    if (msg.includes("XNNPACK delegate")) return;
    if (msg.includes("TensorFlow Lite")) return;

    info(...args);
  };
}
