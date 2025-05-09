import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

import Card from './courses/Card';
import courseImage from './assets/Teaching-Data-Structures-and-Algorithms.jpg';
import authorImage from './assets/Gahinath_Madake.jpg';
import Spinner from "@/Spinner/Spinner";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";





interface Course{
  uuid: string;
  title: string;
  branch: string;
  duration: string;
  about: string;
  imageURL: string;
  author: string;
  authorImage: string;
}

const course = [
  {
      uuid: uuidv4(),
      title: "Data Structures and Algorithms",
      branch: "CS",
      duration: "6 months",
      about: "Master core data structures and algorithms for efficient problem-solving in coding interviews.",
      imageURL: courseImage,
      author: "Gahinath Madake",
      authorImage: authorImage,
  },
  {   
      uuid: uuidv4(),
      title: "Operating Systems",
      branch: "CS",
      duration: "5 months",
      about: "Learn OS concepts like process management, memory allocation, and file systems.",
      imageURL: courseImage,
      author: "Gahinath Madake",
      authorImage: authorImage,
  },
  {
    uuid: uuidv4(),
      title: "Database Management Systems",
      branch: "CS",
      duration: "4 months",
      about: "Understand SQL, NoSQL, normalization, and database design for efficient data storage.",
      imageURL: courseImage,
      author: "Gahinath Madake",
      authorImage: authorImage,
  },
  {
      uuid: uuidv4(),
      title: "Computer Networks",
      branch: "CS",
      duration: "5 months",
      about: "Explore networking concepts, protocols, and security for reliable communication.",
      imageURL: courseImage,
      author: "Gahinath Madake",
      authorImage: authorImage,
  },
  {
      uuid: uuidv4(),
      title: "Object-Oriented Programming",
      branch: "CS",
      duration: "4 months",
      about: "Learn OOP principles like encapsulation, inheritance, and polymorphism using Java or C++.",
      imageURL: courseImage,
      author: "Gahinath Madake",
      authorImage: authorImage,
  }
];

const allCourses = () => {
  const { progress } = useParams();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    setLoading(true);

    setCourses(course);

    setLoading(false);
  }, []);

  return (
    <div className='px-20 py-4'>
      
      <div>
        <h1 className="text-xl font-semibold">
          {progress==="ongoing" ? "Ongoing":progress==="completed" ? "Completed":"All"} Courses</h1>
      </div>

      <Separator className="my-2"/>

      <div className='my-4 flex flex-wrap gap-6'>
        { 
          loading
          ?
          <div>
            <Spinner />
          </div>
          :
            
          (
            courses.length <= 0 
            ?
            <p>No Courses available</p>
            :
            courses.map((course, index)=>
              <Link key={index} to={course.uuid}>
                <Card course={course} />
              </Link>
            )
          )
        }  
      </div>
    </div>
  )
}

export default allCourses;