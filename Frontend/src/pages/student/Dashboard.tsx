import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress"

import userImage from './assets/User.png';
import { Link } from 'react-router-dom';
import Chart from './Dashboard/Chart1';

import {
  GraduationCap,
  BadgeCheck,
} from 'lucide-react';

const user = {
  name:"Gahinath Madake"
}

const Dashboard = () => {
  const ongoingCourses = [
    {
      name: "Data Structures",
      progress: 99,
    },
    {
      name: "DBMS",
      progress: 80,
    },
    {
      name: "Operating System",
      progress: 60,
    },
    {
      name: "Computer Network",
      progress: 45,
    },
    {
      name: "TOC",
      progress: 30,
    }
  ]

  const missionVision = {
    mission: "Lorem ipsum dolor sit amet consectetur adipisicing elitfacere enim volunam ipsa nulla sapiente laborum! Blanditiis",
    vision: "ciduntditiis officiis eveniet cum tempore labore fugiat soluta, excepturi nam ipsa nulla sapiente laborum! Blanditiis",
  }


  return (
    <div className='p-4'>
      <div className='flex gap-6'>
        <div className='border shadow-sm w-8/12 px-5 py-6 rounded-md flex gap-10'>
          <div className='m-w-7/12 flex flex-wrap flex-col gap-4'>
            <h1 className='text-2xl font-semibold'> 
              Hi {user.name}, 👋<br/>
              What do you want to learn Toady,
              <br />
              with your Partner ?
            </h1>
            <p className='test-xs'>Discover courses, track progress, and achieve your learning goals seamlessly.</p>
            <Link to='/student/courses/all'>
              <Button className='bg-blue-500'>Explore Courses</Button>
            </Link>
          </div>

          <img src={userImage} alt="user" className='w-[300px]'/>
        </div>

        <div className='w-3/12'>
          <div className='w-full p-3 rounded-md shadow-sm border'>
            <div className='flex justify-between'>
              <div className='w-[40px] h-[40px] rounded-full bg-blue-500 flex justify-center items-center'>
                <GraduationCap  stroke="black" fill='white'/>
              </div>

              <div className='w-32'>
                <Chart />
              </div>
            </div>

            <h1>
              <h1 className='font-semibold text-lg'>151+</h1>
              <h1>Completed Courses</h1>
            </h1>
          </div>

          <div className='w-full p-3 mt-2 rounded-md shadow-sm border'>
            <div className='flex justify-between'>
              <div className='w-[40px] h-[40px] rounded-full bg-blue-500 flex justify-center items-center'>
                <BadgeCheck  stroke="black" fill='white'/>
              </div>

              <div className='w-32'>
                <Chart />
              </div>
            </div>

            <h1>
              <h1 className='font-semibold text-lg'>27+</h1>
              <h1>Ongoing Courses</h1>
            </h1>
          </div>
        </div>
      </div>

      <div className='my-6 grid grid-cols-5 gap-6'>
        
        <div className='col-span-3'>
          <div>
            <h1 className='text-xl font-semibold'>Ongoing Courses</h1>
            
            <div className='my-3 px-5 py-3 w-full border shadow-sm rounded-sm'>
              {
                ongoingCourses.map((course, index) => (
                  <div key={index} className='mb-3'>
                    <div className="mb-2 flex justify-between">
                      <h2 className="font-semibold">{course.name}</h2>
                      <p>{course.progress}%</p>
                    </div>
                    <Progress value={course.progress} />
                  </div>
                ))
              }  
            </div>
          </div>

          <div className='mt-6 px-5 py-4 border shadow-sm rounded-sm'>
            <div>
              <h2 className='font-semibold text-xl'>Our Mission</h2>
              <p>{missionVision.mission}</p>
            </div>

            <div className='mt-6'>
              <h2 className='font-semibold text-xl'>Our Vission</h2>
              <p>{missionVision.vision}</p>
            </div>
          </div>
        </div>

        <div className='col-span-2'>
          
        </div>
      </div>
    </div>
  )
}

export default Dashboard;



