import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import image from '../assets/contactForm.webp';
import { useTheme } from "@/components/theme-provider";
import blackmit from '../assets/MITAOE-black.png';
import whitemit from '../assets/MITAOE-white.png';
import Card from '../courses/Card';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import courseImage from '../assets/Teaching-Data-Structures-and-Algorithms.jpg';
import authorImage from '../assets/Gahinath_Madake.jpg';

// Course Interface and Related Models
interface User {
  id: string;
  name: string;
  email: string;
}

interface School {
  id: string;
  name: string;
  schoolImage: string;
  createdAt: Date;
}

interface Semester {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

interface Chapter {
  id: string;
  title: string;
  courseId: string;
}

interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: Date;
}

interface Test {
  id: string;
  title: string;
  courseId: string;
  createdAt: Date;
}

interface Question {
  id: string;
  text: string;
  testId: string;
}

interface Course {
  id: string;
  name: string;
  description?: string; // Optional
  teacher: User;
  teacherId: string;
  school: School;
  schoolId: string;
  semester: Semester;
  semesterId: string;
  createdAt: Date;

  chapters: Chapter[];
  enrollments: Enrollment[];
  tests: Test[];
  questions: Question[];
}


// const courseUnderDept = [{
//     id: "1a2b3c4d-5678-9101-1121-314151617181",
//     name: "Data Structures & Algorithms",
//     description: "Comprehensive course on DSA covering arrays, trees, graphs, and dynamic programming.",
//     teacher: { id: "t1", name: "Dr. John Doe", email: "johndoe@example.com" },
//     teacherId: "t1",
//     school: { id: "s1", name: "SCET", schoolImage: "school1.jpg", createdAt: new Date("2024-01-01") },
//     schoolId: "s1",
//     semester: { id: "sem1", name: "Semester 3", startDate: new Date("2024-06-01"), endDate: new Date("2024-12-01") },
//     semesterId: "sem1",
//     createdAt: new Date(),

//     chapters: [
//       { id: "ch1", title: "Introduction to DSA", courseId: "1a2b3c4d-5678-9101-1121-314151617181" },
//       { id: "ch2", title: "Sorting Algorithms", courseId: "1a2b3c4d-5678-9101-1121-314151617181" },
//     ],
//     enrollments: [],
//     tests: [{ id: "test1", title: "DSA Basics Test", courseId: "1a2b3c4d-5678-9101-1121-314151617181", createdAt: new Date() }],
//     questions: [],
//   },
//   {
//     id: "2b3c4d5e-6789-1011-1213-141516171819",
//     name: "Web Development",
//     description: "Full-stack web development course using MERN stack.",
//     teacher: { id: "t2", name: "Jane Smith", email: "janesmith@example.com" },
//     teacherId: "t2",
//     school: { id: "s1", name: "SCET", schoolImage: "school1.jpg", createdAt: new Date("2024-01-01") },
//     schoolId: "s1",
//     semester: { id: "sem2", name: "Semester 4", startDate: new Date("2024-01-15"), endDate: new Date("2024-07-15") },
//     semesterId: "sem2",
//     createdAt: new Date(),

//     chapters: [
//       { id: "ch3", title: "HTML & CSS Basics", courseId: "2b3c4d5e-6789-1011-1213-141516171819" },
//       { id: "ch4", title: "React Basics", courseId: "2b3c4d5e-6789-1011-1213-141516171819" },
//     ],
//     enrollments: [],
//     tests: [{ id: "test2", title: "MERN Stack Test", courseId: "2b3c4d5e-6789-1011-1213-141516171819", createdAt: new Date() }],
//     questions: [],
//   },
//   {
//     id: "3c4d5e6f-7891-0111-2131-415161718192",
//     name: "Machine Learning",
//     description: "Introduction to ML concepts, supervised and unsupervised learning.",
//     teacher: { id: "t3", name: "Dr. Alan Turing", email: "turing@example.com" },
//     teacherId: "t3",
//     school: { id: "s2", name: "Computer Science", schoolImage: "school2.jpg", createdAt: new Date("2023-12-01") },
//     schoolId: "s2",
//     semester: { id: "sem3", name: "Semester 5", startDate: new Date("2024-08-01"), endDate: new Date("2025-01-01") },
//     semesterId: "sem3",
//     createdAt: new Date(),

//     chapters: [
//       { id: "ch5", title: "Linear Regression", courseId: "3c4d5e6f-7891-0111-2131-415161718192" },
//       { id: "ch6", title: "Neural Networks", courseId: "3c4d5e6f-7891-0111-2131-415161718192" },
//     ],
//     enrollments: [],
//     tests: [{ id: "test3", title: "ML Basics Test", courseId: "3c4d5e6f-7891-0111-2131-415161718192", createdAt: new Date() }],
//     questions: [],
//   },
//   {
//     id: "4d5e6f7g-8910-1112-3141-516171819202",
//     name: "Cyber Security",
//     description: "Cybersecurity principles, ethical hacking, and penetration testing.",
//     teacher: { id: "t4", name: "Kevin Mitnick", email: "kevin@example.com" },
//     teacherId: "t4",
//     school: { id: "s3", name: "Electronics & Communication", schoolImage: "school3.jpg", createdAt: new Date("2023-11-01") },
//     schoolId: "s3",
//     semester: { id: "sem4", name: "Semester 6", startDate: new Date("2024-06-01"), endDate: new Date("2024-12-01") },
//     semesterId: "sem4",
//     createdAt: new Date(),

//     chapters: [
//       { id: "ch7", title: "Network Security Basics", courseId: "4d5e6f7g-8910-1112-3141-516171819202" },
//       { id: "ch8", title: "Penetration Testing", courseId: "4d5e6f7g-8910-1112-3141-516171819202" },
//     ],
//     enrollments: [],
//     tests: [{ id: "test4", title: "Cyber Security Test", courseId: "4d5e6f7g-8910-1112-3141-516171819202", createdAt: new Date() }],
//     questions: [],
//   },
//   {
//     id: "5e6f7g8h-9101-1121-4151-617181920212",
//     name: "Cloud Computing",
//     description: "AWS, Azure, and Google Cloud fundamentals.",
//     teacher: { id: "t5", name: "Jeff Bezos", email: "jeff@example.com" },
//     teacherId: "t5",
//     school: { id: "s4", name: "Mechanical Engineering", schoolImage: "school4.jpg", createdAt: new Date("2024-02-01") },
//     schoolId: "s4",
//     semester: { id: "sem5", name: "Semester 7", startDate: new Date("2025-01-15"), endDate: new Date("2025-07-15") },
//     semesterId: "sem5",
//     createdAt: new Date(),

//     chapters: [
//       { id: "ch9", title: "Cloud Infrastructure", courseId: "5e6f7g8h-9101-1121-4151-617181920212" },
//       { id: "ch10", title: "Serverless Computing", courseId: "5e6f7g8h-9101-1121-4151-617181920212" },
//     ],
//     enrollments: [],
//     tests: [{ id: "test5", title: "Cloud Computing Test", courseId: "5e6f7g8h-9101-1121-4151-617181920212", createdAt: new Date() }],
//     questions: [],
//   },
//   {
//     id: "6f7g8h9i-1011-1213-1415-161718192021",
//     name: "Artificial Intelligence",
//     description: "Deep dive into AI, including NLP and computer vision.",
//     teacher: { id: "t6", name: "Elon Musk", email: "elon@example.com" },
//     teacherId: "t6",
//     school: { id: "s5", name: "Civil Engineering", schoolImage: "school5.jpg", createdAt: new Date("2023-10-01") },
//     schoolId: "s5",
//     semester: { id: "sem6", name: "Semester 8", startDate: new Date("2025-08-01"), endDate: new Date("2026-01-01") },
//     semesterId: "sem6",
//     createdAt: new Date(),

//     chapters: [
//       { id: "ch11", title: "Intro to AI", courseId: "6f7g8h9i-1011-1213-1415-161718192021" },
//       { id: "ch12", title: "Neural Networks", courseId: "6f7g8h9i-1011-1213-1415-161718192021" },
//     ],
//     enrollments: [],
//     tests: [{ id: "test6", title: "AI Basics Test", courseId: "6f7g8h9i-1011-1213-1415-161718192021", createdAt: new Date() }],
//     questions: [],
//   },
// ];

interface Department {
  id: string;
  name: string;
  createdAt: string;
  imageURL: string;
}

const dept = {
  id: '1a2b3c4d-5678-9101-1121-314151617181',
  name: 'SCET',
  createdAt: '19, Sep 2024',
  imageURL: image,
};



const courseUnderDept = [
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


interface c {
  uuid: string;
  title: string;
  branch: string;
  duration: string;
  about: string;
  imageURL: string;
  author: string;
  authorImage: string;
}


const Department = () => {
    const {schoolId} = useParams();
    console.log(schoolId);
    const { theme } = useTheme();

    const [school, setSchool] = useState< Department | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCourse, setSelectedCourse] = useState<c | null>(null);
    const [course, setCourse] = useState<c[]>([]);

    useEffect(()=>{
        setLoading(true);

        setCourse(courseUnderDept);
        setSchool(dept);

        setLoading(false);
    }, []);


  // Selected Courses Update
  const handleCardClick = (course: c) => {
    setSelectedCourse(course);
    console.log(course);
  };

  return (
    <div className='px-20 py-4'>
      <div className='p-4 py-5 mt-5 border shadow-sm flex center justify-center items-center flex-col'>
        {
          school &&
          <>
            <img src={theme === "dark" ? blackmit : whitemit} alt="MITAOE Logo" className='w-6/12' />
            <h1 className='text-2xl font-semibold'>{school.name}</h1>
          </>
        }
      </div>

      <div className='flex gap-1'>
        <Link to='/student/sitehome'>SiteHome</Link>
        <span>/</span>
        {
          school &&
          <div 
            className="cursor-pointer" 
            onClick={
            async() => {
              setSelectedCourse(null)
            }
          }>{school.name}</div>
        }
        {
          selectedCourse &&
          <>
            <span>/</span>
            <div>{selectedCourse.title}</div>
          </>
        }

      </div>

      {
        selectedCourse ?
        <div className='w-full border shadow-sm'>
          dccbhjhsghfhdjghkdgryt
        </div>

        :

        <div className='p-4 mt-7 flex gap-4 flex-wrap'>
          {
            course.map((course, index)=>
              <div
                key={index}
                onClick={() => handleCardClick(course)}
                className="cursor-pointer"
              >
                <Card course={course} />
              </div>
            )
          } 
        </div>


      }
    </div>
  )
}

export default Department;