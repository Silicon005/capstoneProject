import React, { useState, useEffect } from "react";

interface RemainingTimeProps {
  duration: number;
  submitTestHandller:()=>void; // Duration in seconds
}

const RemainingTime: React.FC<RemainingTimeProps> = ({ duration, submitTestHandller }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      submitTestHandller();
      return;
    }

    // Update the timer every second
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Cleanup the interval on unmount
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Convert seconds into hours, minutes, and seconds
  const formatTime = (seconds: number) => {

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")} 
      : ${minutes.toString().padStart(2, "0")}
      : ${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="py-2 px-4 shadow-sm text-center flex gap-2">
      <span className="text-lg font-bold text-blue-800">Remaining Time: </span>
      <span className="text-xl font-semibold text-blue-600">
        {timeLeft > 0 ? formatTime(timeLeft) : "Time's up!"}
      </span>
    </div>
  );
};

export default RemainingTime;