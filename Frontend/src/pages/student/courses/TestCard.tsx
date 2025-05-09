import React from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import ProgressCircular from '../common/ProgressCircular';
import { Button } from '@/components/ui/button';

interface TestData {
  id: number;
  Questions: number;
  Time: string;
  type: string;
  topic: string;
  title: string;
}

interface TestCardProps {
  Test: TestData;
}

const testData = [
  {
    level: "Level 1",
    type: "Beginner",
    status: "Completed",
    date: "11 September, 2025",
  },
  {
    level: "Level 2",
    type: "Intermediate",
    status: "Ongoing",
    date: "15 September, 2025",
  },
  {
    level: "Level 3",
    type: "Advanced",
    status: "Upcoming",
    date: "20 September, 2025",
  },
  {
    level: "Level 4",
    type: "Beginner",
    status: "Completed",
    date: "25 September, 2025",
  },
  {
    level: "Level 5",
    type: "Intermediate",
    status: "Upcoming",
    date: "30 September, 2025",
  },
  {
    level: "Level 6",
    type: "Advanced",
    status: "Ongoing",
    date: "5 October, 2025",
  },
  {
    level: "Level 7",
    type: "Beginner",
    status: "Completed",
    date: "10 October, 2025",
  },
  {
    level: "Level 8",
    type: "Intermediate",
    status: "Ongoing",
    date: "15 October, 2025",
  },
];

const TestCard: React.FC<TestCardProps> = ({Test}) => {
  return (
    <div className='w-full pl-3'>
      <table className='w-full'>
        
        <thead>
          <tr className='border-b'>
            <td className='p-3 w-4/12 '>Test</td>
            <td className='p-3 w-3/12'>Scheduled At</td>
            <td className='p-3 w-3/12 text-center'>Status</td>
            <td className='p-3 w-2/12'>Action</td>
          </tr>
        </thead>

        <tbody>
        {testData.map((test, index) => (
          <tr key={index}>
            <td className="px-2 py-2">
              <div className='flex items-center gap-4'>
                  <ProgressCircular  progress={100} size={55}/>
                  <div>
                      <h1 className='font-semibold text-xl'>{test.level}</h1>
                      <p className='italic'>Beginer</p>
                  </div>
              </div>
            </td>


            <td className="font-semibold text-md">{test.date}</td>


            <td>
              <div className='flex justify-center'>
                <Button
                  className={`rounded-full cursor-auto ${
                    test.status === "Completed"
                      ? "bg-green-400 hover:bg-green-500"
                      : test.status === "Ongoing"
                      ? "bg-yellow-400 hover:bg-yellow-500"
                      : "bg-blue-400 hover:bg-blue-500"
                  }`}
                >
                  {test.status}
                </Button>
              </div>
            </td>


            <td className=''>
              <Link to='/student/course/test'>
                <Button className='rounded-full bg-green-400 hover:bg-green-500 text-black font-semibold'>Checkout</Button>
              </Link>
            </td>

          </tr>
        ))}
        </tbody>
      </table>

    </div>
  )
}

export default TestCard;