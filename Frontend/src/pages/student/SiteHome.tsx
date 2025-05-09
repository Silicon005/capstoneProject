import React, {useState, useEffect} from 'react';
import image from './assets/contactForm.webp';
import SchoolCard from './sitehhome/SchoolCard';
import Spinner from '@/Spinner/Spinner';

// Define TypeScript interface for Department
interface Department {
  id: string;
  name: string;
  createdAt: string;
  imageURL: string;
}

// Department data array
const Departments: Department[] = [
  {
    id: '1a2b3c4d-5678-9101-1121-314151617181',
    name: 'SCET',
    createdAt: '19, Sep 2024',
    imageURL: image,
  },
  {
    id: '2b3c4d5e-6789-1011-1213-141516171819',
    name: 'Computer Science',
    createdAt: '22, Oct 2024',
    imageURL: image,
  },
  {
    id: '3c4d5e6f-7891-0111-2131-415161718192',
    name: 'Electronics & Communication',
    createdAt: '05, Nov 2024',
    imageURL: image,
  },
  {
    id: '4d5e6f7g-8910-1112-3141-516171819202',
    name: 'Mechanical Engineering',
    createdAt: '12, Aug 2024',
    imageURL: image,
  },
  {
    id: '5e6f7g8h-9101-1121-4151-617181920212',
    name: 'Civil Engineering',
    createdAt: '30, July 2024',
    imageURL: image,
  },
];

const SiteHome: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    setLoading(true);

    setDepartments(Departments);

    setLoading(false);
  }, []);




  return (
    <div className='px-20 py-4'>
      <h1 className='text-2xl font-bold mb-4'>Departments</h1>
      {
        loading
        ?
        <div className='w-full h-screen flex justify-center items-center'>
          <Spinner />
        </div>
        :
        (
          departments.length <= 0
          ?
          <p>No Department available at now</p>
          :
          <div className='flex flex-wrap gap-6'>
            {departments.map((department) => (
              <SchoolCard key={department.id} school={department} />
            ))}
          </div>
        )
      }
    </div>
  );
};

export default SiteHome;
