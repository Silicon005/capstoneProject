import { useEffect } from "react";

const CheckExpiry = () => {
  useEffect(() => {
    const storedTime = localStorage.getItem("questions_timestamp");
    const currentTime = Date.now();

    if (storedTime) {
      const timeDifference = currentTime - parseInt(storedTime, 10);
      const twoHours = 1 * 60 * 1000;

      if (timeDifference > twoHours) {
        localStorage.removeItem("questions");
        localStorage.removeItem("questions_timestamp");
      }
    } else {
      localStorage.setItem("questions_timestamp", currentTime.toString());
    }
  }, []);

  return null;
};

export default CheckExpiry;