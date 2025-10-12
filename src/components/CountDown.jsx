import React from "react";
import Countdown from "react-countdown";

export default function MyCountdown({ targetDate }) {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <div className="text-center text-white text-2xl font-semibold">
          🎉 The event has started!
        </div>
      );
    } else {
      return (
        <div className="flex justify-center gap-5 sm:gap-8 text-white font-light">
          {[
            { label: "days", value: days },
            { label: "hours", value: hours },
            { label: "minutes", value: minutes },
            { label: "seconds", value: seconds },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
                {item.label}
              </span>
              <span className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-none">
                {String(item.value).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="w-full text-center">
      <Countdown date={targetDate} renderer={renderer} />
    </div>
  );
}
