"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export default function useMessageHelper(timeout = 3500) {
  const [message, setMessage] = useState(null); // Bisa error atau success
  const [type, setType] = useState(null); // "error" | "success"
  const timerRef = useRef(null);

  const showMessage = useCallback(
    (msg, msgType = "error") => {
      setMessage(msg);
      setType(msgType);

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setMessage(null);
        setType(null);
        timerRef.current = null;
      }, timeout);
    },
    [timeout]
  );

  // Clear timeout saat unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { message, type, showMessage };
}
