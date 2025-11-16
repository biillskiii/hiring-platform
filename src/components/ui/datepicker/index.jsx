// Updated DatePicker component with helperText, error, and success props
"use client";
import React, { useState, useEffect } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export default function DatePicker({
  selectedDate,
  onDateChange,
  helperText,
  error,
  success,
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [view, setView] = useState("day");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (selectedDate) setCurrentDate(new Date(selectedDate));
  }, [selectedDate]);

  const yearsRange = () => {
    const start = Math.floor(currentDate.getFullYear() / 10) * 10;
    return Array.from({ length: 10 }, (_, i) => start + i);
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate);
    newDate.setDate(day);
    onDateChange(newDate);
    setShowPicker(false);
  };

  const handleMonthClick = (month) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month);
    setCurrentDate(newDate);
    setView("day");
  };

  const handleYearClick = (year) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setView("month");
  };

  const handleDecadeClick = (year) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setView("year");
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const jsDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const firstDay = (jsDay + 6) % 7;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  return (
    <div className="relative w-full">
      <div
        onClick={() => setShowPicker(!showPicker)}
        className={`flex items-center justify-between w-full border rounded-md px-3 py-2 cursor-pointer transition
          ${
            error
              ? "border-danger-main ring-1 ring-danger-main"
              : success
              ? "border-success-main ring-1 ring-success-main"
              : "border-neutral-50 hover:border-neutral-80"
          }`}
      >
        <div className="flex items-center gap-2 text-neutral-60">
          <CalendarIcon width={18} />
          <span className={selectedDate ? "text-black" : "text-gray-400"}>
            {selectedDate
              ? new Date(selectedDate).toLocaleDateString("en-GB")
              : "Select date of birth"}
          </span>
        </div>
        <ChevronDownIcon width={15} />
      </div>

      {/* Helper / Error / Success Text */}
      {helperText && !error && !success && (
        <p className="text-xs text-neutral-70 mt-1">{helperText}</p>
      )}
      {error && <p className="text-xs text-danger-main mt-1">{error}</p>}
      {success && !error && (
        <p className="text-xs text-success-main mt-1">{success}</p>
      )}

      {showPicker && (
        <div className="absolute z-50 mt-2 left-0 bg-white border border-gray-300 rounded-md shadow-md p-4 w-92">
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                if (view === "day")
                  newDate.setMonth(currentDate.getMonth() - 1);
                if (view === "month")
                  newDate.setFullYear(currentDate.getFullYear() - 1);
                if (view === "year")
                  newDate.setFullYear(currentDate.getFullYear() - 10);
                if (view === "decade")
                  newDate.setFullYear(currentDate.getFullYear() - 30);
                setCurrentDate(newDate);
              }}
            >
              «
            </button>

            <button
              onClick={() => {
                if (view === "day") setView("month");
                else if (view === "month") setView("year");
                else if (view === "year") setView("decade");
              }}
              className="font-semibold"
            >
              {view === "day" &&
                `${
                  months[currentDate.getMonth()]
                } ${currentDate.getFullYear()}`}
              {view === "month" && currentDate.getFullYear()}
              {view === "year" &&
                `${Math.floor(currentDate.getFullYear() / 10) * 10} - ${
                  Math.floor(currentDate.getFullYear() / 10) * 10 + 9
                }`}
              {view === "decade" && "Select Decade"}
            </button>

            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                if (view === "day")
                  newDate.setMonth(currentDate.getMonth() + 1);
                if (view === "month")
                  newDate.setFullYear(currentDate.getFullYear() + 1);
                if (view === "year")
                  newDate.setFullYear(currentDate.getFullYear() + 10);
                if (view === "decade")
                  newDate.setFullYear(currentDate.getFullYear() + 30);
                setCurrentDate(newDate);
              }}
            >
              »
            </button>
          </div>

          {view === "day" && (
            <>
              <div className="grid grid-cols-7 text-right text-xs text-gray-500 mb-2">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d, i) => (
                  <div key={i} className="w-8 whitespace-nowrap">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 text-center gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isSelected =
                    selectedDate &&
                    new Date(selectedDate).toDateString() ===
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day
                      ).toDateString();

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`rounded-md p-1 text-sm hover:bg-indigo-100 transition ${
                        isSelected ? "bg-indigo-500 text-white" : ""
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {view === "month" && (
            <div className="grid grid-cols-3 gap-2 text-center">
              {months.map((m, i) => (
                <button
                  key={m}
                  onClick={() => handleMonthClick(i)}
                  className="p-2 hover:bg-indigo-100 rounded-md"
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          {view === "year" && (
            <div className="grid grid-cols-3 gap-2 text-center">
              {yearsRange().map((y) => (
                <button
                  key={y}
                  onClick={() => handleYearClick(y)}
                  className="p-2 hover:bg-indigo-100 rounded-md"
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {view === "decade" &&
            (() => {
              const start = Math.floor(currentDate.getFullYear() / 100) * 100;
              return (
                <div className="grid grid-cols-3 gap-2 text-center">
                  {Array.from({ length: 12 }, (_, i) => {
                    const decadeStart = start + i * 10;
                    return (
                      <button
                        key={decadeStart}
                        onClick={() => handleDecadeClick(decadeStart)}
                        className="p-2 hover:bg-indigo-100 rounded-md"
                      >
                        {decadeStart}-{decadeStart + 9}
                      </button>
                    );
                  })}
                </div>
              );
            })()}
        </div>
      )}
    </div>
  );
}
