import React from "react";
import { Link } from "react-router-dom";
import CountdownTimer from "./CountDownTimer";
import { Button } from "@/components/ui/button";
import { Clock4, CalendarDays, CalendarCheck } from "lucide-react";

interface TestData {
  heading: string;
  duration: string;
  startTime: string;
  endTime: string;
  ongoing:boolean,
}

interface ComingSoonProps {
  testData: TestData;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ testData }) => {

    const timer = {
        heading: testData.ongoing?
                "🔥 Test in Progress! It ends in:"
                :
                "⏳ Test Will Start Soon",
        subHeading:
                testData.ongoing?
                "Time is running ⏳, give it try!"
                :
                "🚀 Get ready! The test will begin in:",
        time: testData.ongoing?testData.endTime: testData.startTime,
    }
    

  return (
    <div className="mt-5 p-5 w-full rounded-sm border shadow-sm flex flex-wrap-reverse justify-around gap-10">
      <div className="w-6/12">
        <h2 className="text-2xl font-semibold">
          {testData.heading}
        </h2>

        <div className="pl-3 mt-5 grid gap-2">
          <div className="flex gap-2">
            <CalendarDays size={20} />
            <span>Start Time:</span>
            <span>{new Date(testData.startTime).toLocaleString()}</span>
          </div>

          <div className="flex gap-2">
            <CalendarCheck size={20} />
            <span>End Time:</span>
            <span>{new Date(testData.endTime).toLocaleString()}</span>
          </div>

          <div className="flex gap-2">
            <Clock4 size={20} />
            <span>Duration:</span>
            <span>{testData.duration}</span>
          </div>
        </div>

        {testData.ongoing && (
          <div className="p-3 w-full">
            <Link to="/exam/test/123">
              <Button>Participate</Button>
            </Link>
          </div>
        )}
      </div>

      <div className="">
        <CountdownTimer startTime={timer.time} timer={timer} />
      </div>
    </div>
  );
};

export default ComingSoon;
