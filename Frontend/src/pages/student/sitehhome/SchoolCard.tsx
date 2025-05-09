import React from 'react';
import { Link } from 'react-router-dom';

// Define the TypeScript interface for department props
interface Department {
  id: string;
  name: string;
  createdAt: string;
  imageURL: string;
}

interface SchoolCardProps {
  school: Department;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school }) => {
  return (
    <Link to={`/student/school/${school.id}`}>
        <div className='w-[350px] min-w-[300px] shadow-sm border'>
        {/* Display Image */}
        <img src={school.imageURL} alt={school.name} className="w-full h-48 object-cover" />
        
        {/* Department Info */}
        <div className='p-4'>
            <h1 className='text-lg font-semibold'>{school.name}</h1>
            <p className=' text-sm'>{school.createdAt}</p>
        </div>
        </div>
    </Link>
  );
};

export default SchoolCard;
