import React from "react";
import Chip from "@/components/ui/chip";
import Button from "@/components/ui/button";

const ModalJobAdmin = ({ status, date, title, salary, onClick }) => {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "primary";
      case "inactive":
        return "danger";
      case "draft":
        return "secondary";
      default:
        return "tertiary";
    }
  };

  return (
    <div className="h-[156px] bg-white flex flex-col justify-center p-5 shadow-modal w-full rounded-xl">
      <div className="w-full flex items-center gap-x-4 mb-3">
        <Chip
          label={status}
          variant={getStatusVariant(status)}
          className="mr-2 mb-2"
        />
        <Chip label={date} variant="tertiary" />
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="flex items-center justify-between">
          <p className="text-base text-neutral-70">{salary}</p>
          <Button label={"Manage job"} onClick={onClick} size="small" />
        </div>
      </div>
    </div>
  );
};

export default ModalJobAdmin;
