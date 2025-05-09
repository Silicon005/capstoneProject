import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CourseIcon from '@/assets/courseImages.jpg';
interface Course {
  id: string;
  name: string;
  title: string;
  url: string;
}

const ViewAllCourses: React.FC = () => {
    const { teacherId } = useParams<{ teacherId: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!teacherId) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/teacher/courses?teacherId=${teacherId}`
        );
        if (response.status !== 200) throw new Error("Failed to fetch courses");

        const data = response.data;
        setCourses(
          data.courses.map((course: any) => ({
            id: course.id,
            name: course.name,
            title: course.description || "No description",
            url: `/teacher-dashboard/courses/${course.id}`,
          }))
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [teacherId]);

  if (loading) return <div className="text-center py-10 text-lg">Loading courses...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            onClick={() => navigate(course.url)}
            className="cursor-pointer hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader>
              <img
                src={CourseIcon}
                alt={course.name}
                className="w-full h-48 object-cover rounded-md"
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl font-semibold mb-2">{course.name}</CardTitle>
              <p className="text-sm text-gray-600">{course.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ViewAllCourses;
