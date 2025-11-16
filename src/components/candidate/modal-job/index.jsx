import React from "react";
import Image from "next/image";
import { CurrencyDollarIcon, MapPinIcon } from "@heroicons/react/24/outline";

const ModalJob = ({
  img,
  title,
  company,
  location,
  salary,
  onClick,
  id,
  isSelected,
}) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={`bg-primary-surface cursor-pointer text-neutral-90 w-[300px] h-[140px] rounded-lg px-4 py-3 shadow-modal 
        ${
          isSelected
            ? "border-2 border-primary-main"
            : "border border-transparent"
        } 
        hover:border-primary-main`}
    >
      <div className="flex items-center gap-x-4">
        <div className="border border-neutral-40 rounded-sm w-12 h-12 overflow-hidden">
          <Image src={img} alt={title} width={48} height={48} className="p-1" />
        </div>
        <div className="">
          <h1 className="font-bold text-[16px]">{title}</h1>
          <p className="text-sm ">{company}</p>
        </div>
      </div>
      <div className="text-xs mt-4 space-y-2">
        <h1 className="flex items-center gap-x-1">
          <MapPinIcon width={15} />
          {location}
        </h1>
        <p className="flex items-center gap-x-1">
          <CurrencyDollarIcon width={15} />
          {salary}
        </p>
      </div>
    </div>
  );
};

export default ModalJob;
