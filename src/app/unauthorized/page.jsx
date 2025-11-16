import Image from "next/image";
import React from "react";
import UnauthorizedImage from "../../../public/assets/empty-state.svg";
const Unauthorized = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-40">
      <div className="bg-neutral-20  p-5 rounded-xl shadow-modal flex flex-col items-center gap-y-5">
        <Image
          src={UnauthorizedImage}
          width={200}
          height={200}
          alt="unathorized"
        />
        <h1 className="text-2xl font-bold">Tidak dapat mengakses halaman ini!</h1>
      </div>
    </div>
  );
};

export default Unauthorized;
