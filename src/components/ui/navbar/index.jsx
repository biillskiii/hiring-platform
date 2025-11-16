import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import Button from "../button";

const Navbar = ({ avatar, fallback }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <div className="p-5 flex justify-between w-full shadow-xl relative">
      <p className="font-bold text-[18px]">Job List</p>

      <div className="relative" ref={dropdownRef}>
        {avatar ? (
          <Image
            src={avatar}
            alt="avatar"
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            {fallback || "?"}
          </div>
        )}

        {open && (
          <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md border border-gray-200 z-50">
            <Button onClick={handleLogout} label={"Logout"} variant="danger"/>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
