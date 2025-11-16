"use client";
import React from "react";
import Image from "next/image";
import SuccessSVG from "../../../../../public/assets/success.svg";
import Button from "@/components/ui/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const SuccessApply = () => {
  const handleBack = () => {
    window.location.href = "/";
  };
  return (
    <div className="min-h-screen  w-full text-neutral-90 bg-neutral-20 flex justify-center items-center">
      <div className="w-[606px]   flex flex-col justify-center items-center gap-6">
        <Image src={SuccessSVG} alt="success" width={214} height={214} />
        <h1 className="text-2xl font-semibold ">
          🎉 Your application was sent!
        </h1>
        <p className="text-[16px] text-center ">
          Congratulations! You've taken the first step towards a rewarding
          career at Rakamin. We look forward to learning more about you during
          the application process.
        </p>
        <Button
          label={"Back"}
          leftIcon={<ArrowLeftIcon width={15} />}
          size="small"
          onClick={handleBack}
        />
      </div>
    </div>
  );
};

export default SuccessApply;
