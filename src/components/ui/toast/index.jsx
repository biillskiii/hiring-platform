"use client";

import { ToastContainer, toast, cssTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

// CUSTOM SLIDE LEFT ANIMATION
const SlideLeft = cssTransition({
  enter: "slide-enter",
  exit: "slide-exit",
  duration: [300, 300],
});

export default function ToastProvider() {
  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000} // ← toast hilang dalam 5 detik
        transition={SlideLeft} // ← custom slide ke kiri
        hideProgressBar={false}
        closeButton={({ closeToast }) => (
          <button
            onClick={closeToast}
            className="text-neutral-900 text-xl px-2 font-light"
          >
            ✕
          </button>
        )}
        icon={({ type }) => {
          if (type === "success") {
            return <CheckCircleIcon className="text-primary-main w-6 h-6" />;
          }
          if (type === "error") {
            return (
              <ExclamationCircleIcon className="text-danger-main w-6 h-6" />
            );
          }
        }}
        toastClassName={() =>
          `
          flex items-center gap-4 w-full min-w-[350px] 
          !bg-white !text-neutral-900 font-medium
          rounded-2xl shadow-lg px-5 py-4
        `
        }
        progressClassName={() => `
          !bg-primary-main h-1 rounded-full
        `}
      />

      {/* Custom animation styles */}
      <style jsx global>{`
        .slide-enter {
          transform: translateX(-20%);
          opacity: 0;
        }
        .slide-enter-active {
          transform: translateX(0);
          opacity: 1;
          transition: all 300ms ease-in-out;
        }

        .slide-exit {
          transform: translateX(0);
          opacity: 1;
        }
        .slide-exit-active {
          transform: translateX(-120%);
          opacity: 0;
          transition: all 300ms ease-in-out;
        }
      `}</style>
    </>
  );
}
