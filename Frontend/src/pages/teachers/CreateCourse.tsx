import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useParams } from "react-router-dom";

export default function CreateCourseForm() {
  const { teacherId } = useParams<{ teacherId: string }>();
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    semesterId: "",
    schoolId: "",
    teacherId: teacherId,
    enrollmentKey: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const [semesters, setSemesters] = useState<{ id: string; name: string }[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [semesterRes, schoolRes] = await Promise.all([
          axios.get("http://localhost:3000/api/semesters"),
          axios.get("http://localhost:3000/api/schools"),
        ]);
        setSemesters(semesterRes.data);
        setSchools(schoolRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setCourseData({ ...courseData, [field]: value });
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    for (const key of Object.keys(courseData)) {
      if (!courseData[key as keyof typeof courseData]) {
        newErrors[key] = true;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createCourse = async () => {
    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:3000/api/teacher/createcourse", courseData);
      alert("Course created successfully!");
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-white text-black dark:bg-black">
      <Card className="w-full max-w-2xl bg-gray-100 dark:bg-sidebar shadow-lg rounded-xl">
        <CardContent className="p-6">
          <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-5">
            Create Course
          </h1>

          {/* Course Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-base font-medium mb-1">Course Name</label>
              <Input
                type="text"
                value={courseData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`h-10 text-base ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && <p className="text-red-500 text-sm">This field is required</p>}
            </div>

            <div>
              <label className="block text-base font-medium mb-1">Course Description</label>
              <Input
                type="text"
                value={courseData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className={`h-10 text-base ${errors.description ? "border-red-500" : ""}`}
              />
              {errors.description && <p className="text-red-500 text-sm">This field is required</p>}
            </div>

            <div>
              <label className="block text-base font-medium mb-1">Enrollment Key</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={courseData.enrollmentKey}
                  onChange={(e) => handleInputChange("enrollmentKey", e.target.value)}
                  className={`h-10 text-base pr-10 ${errors.enrollmentKey ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.enrollmentKey && <p className="text-red-500 text-sm">This field is required</p>}
            </div>

            {/* Semester Dropdown */}
            <div>
              <label className="block text-base font-medium mb-1">Semester</label>
              <Select onValueChange={(value) => handleInputChange("semesterId", value)}>
                <SelectTrigger className={`h-10 text-base ${errors.semesterId ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      {semester.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.semesterId && <p className="text-red-500 text-sm">This field is required</p>}
            </div>

            {/* School Dropdown */}
            <div>
              <label className="block text-base font-medium mb-1">School</label>
              <Select onValueChange={(value) => handleInputChange("schoolId", value)}>
                <SelectTrigger className={`h-10 text-base ${errors.schoolId ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select School" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.schoolId && <p className="text-red-500 text-sm">This field is required</p>}
            </div>
          </div>

          {/* Create Course Button */}
          <div className="mt-5 flex justify-center">
            <Button
              onClick={createCourse}
              className="bg-gray-900 hover:bg-gray-800 text-white py-2 px-6 rounded-md text-base shadow-md transition-all duration-300 ease-in-out"
            >
              Create Course
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
