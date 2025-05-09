import React, { useState } from "react";
import IconAndLabel from '../common/IconAndLabel';

import { LayoutGrid, Clock4 } from 'lucide-react';

interface CourseProps {
  course: {
    title: string;
    branch: string;
    duration: string;
    about: string;
    imageURL: string;
    author: string;
    authorImage: string;
  };
}

const Card: React.FC<CourseProps> = ({ course }) => {
  // const [showMore, setShowMore] = useState<boolean>(false);


  return (
    <div className="w-[300px] p-3 bg-sidebar rounded-lg shadow-xl border flex flex-col min-h-[420px] overflow-hidden">
      <img src={course.imageURL} alt={course.title} className="w-full object-cover rounded-md" />

      <div className="py-3 flex justify-between">
        <IconAndLabel item={{label:course.branch, icon:LayoutGrid}} />
        <IconAndLabel item={{label:course.duration, icon:Clock4}} />
      </div>
      
      <h1 className="opacity-90 py-2 text-xl font-semibold">
        {course.title}
      </h1>
      <p className="opacity-70 mt-2">
        {course.about.slice(0, 200)}
        <span 
          className="text-blue-400 font-semibold"
          // onClick={()=>{
          //   setShowMore(!showMore)
          // }}
        >
          ...
        </span>
      </p>

      <div className="flex items-center gap[5px] mt-4">
        <img src={course.authorImage} alt={course.author} className="w-[30px] h-[30px] rounded-full" />
        <p className="ml-2 opacity-90">{course.author}</p>
      </div>
    </div>
  );
};

export default Card;
