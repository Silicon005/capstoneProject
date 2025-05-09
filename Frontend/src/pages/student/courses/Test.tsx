import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Play,
  Check,
  Users,
  Heart,
  CircleHelp,
  Clock4,
} from 'lucide-react';

// Components
import CommingSoon from '../common/ComingSoon';
import TestAnalytics from "./TestAnalytics";


const Test: React.FC = () => {

    
  const oneWeekLater = new Date();
  oneWeekLater.setDate(oneWeekLater.getDate());
  const startTime = oneWeekLater.toISOString(); // "YYYY-MM-DDTHH:mm:ss.sssZ"
  const endTime = new Date(oneWeekLater.getTime() + 3 * 60 * 60 * 1000).toISOString();

  const Test = {
    level:"Level 1",
    courseName:"Adavanced Data Structures and Algorithms",
    chapter:"Arrays",
    topic:"Basic Concepts",
    completed:false,
  
    likes:215,
    participants:415,
    questions:30,
    duration: "1h:30m",
    startTime:startTime,
    endTime:endTime,
  }

  const now = Date.now();
  const start = new Date(Test.startTime).getTime();
  const end = new Date(Test.endTime).getTime();

  let testStatus = now < start ? "upcoming" : now >= start && now <= end ? "ongoing" : "completed";

  const data = {
    heading: testStatus ==="upcoming" ?
            "Upcoming: Your Next Challenge Awaits!"
            : 
            "Ongoing: Go Ahead, Challenge Just Started!",
    duration: "1h:30m",
    startTime: Test.startTime,
    endTime: Test.endTime,
    ongoing: testStatus==="ongoing",
  };


  return (
    
    <div className="flex flex-col items-center w-full p-6">
      
      {/* Profile Section */}
      <Card className="w-full max-w-5xl rounded-3xl shadow-xl overflow-hidden">
        
        <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left p-8 bg-gradient-to-r from-gray-600 to-green-600">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg flex items-center justify-center">
              {
                Test.completed === false ?
                <Play  size={30}/>
                :
                <Check size={50} className=' font-semibold'/>
              }
          </Avatar>

          <div className="sm:ml-6 mt-4 sm:mt-0">
            <h2 className="text-2xl font-bold text-white">{Test.courseName}</h2>
            <Badge variant="secondary" className="mt-2 bg-white text-blue-600">
              {Test.level}
            </Badge>
            <div className="pt-2">
              <strong>Chapter: </strong>
              <span>{Test.chapter}</span>
            </div>
            <div className="pt-2">
              <strong>Topic: </strong>
              <span>{Test.topic}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm">
                <Heart className="text-red-500 w-8 h-8" />
                <p className="text-xl mt-2">{Test.likes}</p>
                <p className="text-sm">Likes</p>
              </div>

              <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm">
                <Users className="text-blue-500 w-8 h-8" />
                <p className="text-xl mt-2">{Test.participants}</p>
                <p className="text-sm">Participants</p>
              </div>

              <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm">
                <CircleHelp className="text-green-500 w-8 h-8" />
                <p className="text-xl mt-2">{Test.questions}</p>
                <p className="text-sm">Questions</p>
              </div>

              <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm">
                <Clock4  className="text-purple-500 w-8 h-8" />
                <p className="text-xl mt-2">{Test.duration}</p>
                <p className="text-sm">Duration</p>
              </div>
            </div>

            <div className="w-full">
              {testStatus === "upcoming" && <CommingSoon testData={data} />}
              {testStatus === "ongoing" && <CommingSoon testData={data} />}
              {testStatus === "completed" && <TestAnalytics />}
            </div>
          
        </CardContent>
      </Card>
    </div>
  );
};

export default Test;

