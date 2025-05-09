import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import {
  Eye,
  EyeOff,
  ClipboardCopy,
  Check,
  Pencil,
  BookOpen,
  Info,
  GraduationCap,
  School,
  User,
  Save,
  X,
  Search,
  Plus
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface School {
  id: string;
  name: string;
}

interface Semester {
  id: string;
  name: string;
}

interface CourseData {
  name: string;
  description: string;
  enrollmentKey: string;
  teacherName: string;
  semester: string;
  school: string;
  semesterId: string;
  schoolId: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  status: string;
  enrolledAt: string;
}

const CourseSettings = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  
  // Existing state variables
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editingKey, setEditingKey] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [editingSchool, setEditingSchool] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [editingSemester, setEditingSemester] = useState(false);
  const [selectedSemesterId, setSelectedSemesterId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, schoolsRes, semestersRes, enrollmentsRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/teacher/course/${courseId}/settings`),
          axios.get("http://localhost:3000/api/schools"),
          axios.get("http://localhost:3000/api/semesters"),
          axios.get(`http://localhost:3000/api/teacher/enrollments/${courseId}`)
        ]);

        setCourse(courseRes.data);
        setSchools(schoolsRes.data);
        setSemesters(semestersRes.data);
        setEnrolledStudents(enrollmentsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [courseId]);
  const handleCopy = () => {
    if (course?.enrollmentKey) {
      navigator.clipboard.writeText(course.enrollmentKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleSaveKey = async () => {
    if (!newKey.trim()) return;
    try {
      await axios.put(`http://localhost:3000/api/teacher/${courseId}/enrollment-key`, {
        enrollmentKey: newKey,
      });
      setCourse(prev => prev ? { ...prev, enrollmentKey: newKey } : prev);
      setEditingKey(false);
    } catch (err) {
      console.error("Error updating enrollment key:", err);
    }
  };

  const handleManualEnroll = async () => {
    if (!manualEmail.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:3000/api/teacher/enrollments/${courseId}/manual`,
        { email: manualEmail }
      );

      setEnrolledStudents(prev => [...prev, res.data]);
      setManualEmail("");
      setIsAdding(false);
    } catch (err) {
      console.error("Error enrolling student:", err);
    }
  };

  const filteredStudents = enrolledStudents.filter(student =>
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!course) return <div className="text-center mt-10 text-base">Loading...</div>;

  const handleSaveName = async () => {
    try {
      await axios.put(`http://localhost:3000/api/teacher/${courseId}/updateCourse`, {
        name: newName,
      });
      setCourse(prev => prev ? { ...prev, name: newName } : prev);
      setEditingName(false);
    } catch (err) {
      console.error("Error updating course name:", err);
    }
  };

  const handleSaveDescription = async () => {
    try {
      await axios.put(`http://localhost:3000/api/teacher/${courseId}/updateCourse`, {
        description: newDescription,
      });
      setCourse(prev => prev ? { ...prev, description: newDescription } : prev);
      setEditingDescription(false);
    } catch (err) {
      console.error("Error updating description:", err);
    }
  };

  const handleSaveSchool = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/api/teacher/${courseId}/school`, {
        schoolId: selectedSchoolId,
      });
      setCourse(prev => prev ? { 
        ...prev, 
        school: res.data.school,
        schoolId: selectedSchoolId
      } : prev);
      setEditingSchool(false);
    } catch (err) {
      console.error("Error updating school:", err);
    }
  };

  const handleSaveSemester = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/api/teacher/${courseId}/semester`, {
        semesterId: selectedSemesterId,
      });
      setCourse(prev => prev ? { 
        ...prev, 
        semester: res.data.semester,
        semesterId: selectedSemesterId
      } : prev);
      setEditingSemester(false);
    } catch (err) {
      console.error("Error updating semester:", err);
    }
  };

  if (!course) return <div className="text-center mt-10 text-base">Loading...</div>;

  const Section = ({
    icon,
    label,
    value,
    editable = false,
    onEdit,
    isEditing,
    children,
  }: {
    icon: React.ReactNode;
    label: string;
    value?: React.ReactNode;
    editable?: boolean;
    onEdit?: () => void;
    isEditing?: boolean;
    children?: React.ReactNode;
  }) => (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
      <Card className="bg-white dark:bg-sidebar shadow-sm rounded-lg">
        <CardContent className="p-3 text-sm font-medium flex items-center justify-between">
          <div className="flex-1 min-w-0">{children ?? value}</div>
          {editable && !isEditing && (
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              title="Edit"
            >
              <Pencil size={16} />
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="px-4 md:px-16 py-8 min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <h1 className="text-2xl font-bold text-center mb-10">Course Settings</h1>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Course Name */}
        <Section
          icon={<BookOpen size={14} />}
          label="Course Name"
          editable
          isEditing={editingName}
          onEdit={() => {
            setNewName(course.name);
            setEditingName(true);
          }}
        >
          {editingName ? (
            <div className="flex items-center w-full gap-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 px-3 py-1 border rounded-md text-black dark:text-white dark:bg-gray-800"
                placeholder="Enter new course name"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={handleSaveName} title="Save">
                  <Save size={18} className="text-green-600 hover:text-green-700" />
                </button>
                <button onClick={() => setEditingName(false)} title="Cancel">
                  <X size={18} className="text-red-500 hover:text-red-600" />
                </button>
              </div>
            </div>
          ) : (
            <div className="truncate">{course.name}</div>
          )}
        </Section>

        {/* Description */}
        <Section
          icon={<Info size={14} />}
          label="Description"
          editable
          isEditing={editingDescription}
          onEdit={() => {
            setNewDescription(course.description);
            setEditingDescription(true);
          }}
        >
          {editingDescription ? (
            <div className="flex items-center w-full gap-3">
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="flex-1 px-3 py-1 border rounded-md text-black dark:text-white dark:bg-gray-800"
                placeholder="Enter new description"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={handleSaveDescription} title="Save">
                  <Save size={18} className="text-green-600 hover:text-green-700" />
                </button>
                <button onClick={() => setEditingDescription(false)} title="Cancel">
                  <X size={18} className="text-red-500 hover:text-red-600" />
                </button>
              </div>
            </div>
          ) : (
            <div className="truncate">{course.description}</div>
          )}
        </Section>

        {/* Semester */}
        <Section
          icon={<GraduationCap size={14} />}
          label="Semester"
          editable
          isEditing={editingSemester}
          onEdit={() => {
            setSelectedSemesterId(course.semesterId);
            setEditingSemester(true);
          }}
        >
          {editingSemester ? (
            <div className="flex items-center w-full gap-3">
              <select
                value={selectedSemesterId}
                onChange={(e) => setSelectedSemesterId(e.target.value)}
                className="flex-1 px-3 py-1 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                {semesters.map(semester => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button onClick={handleSaveSemester} title="Save">
                  <Save size={18} className="text-green-600 hover:text-green-700" />
                </button>
                <button onClick={() => setEditingSemester(false)} title="Cancel">
                  <X size={18} className="text-red-500 hover:text-red-600" />
                </button>
              </div>
            </div>
          ) : (
            <div className="truncate">{course.semester}</div>
          )}
        </Section>

        {/* School */}
        <Section
          icon={<School size={14} />}
          label="School"
          editable
          isEditing={editingSchool}
          onEdit={() => {
            setSelectedSchoolId(course.schoolId);
            setEditingSchool(true);
          }}
        >
          {editingSchool ? (
            <div className="flex items-center w-full gap-3">
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="flex-1 px-3 py-1 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                {schools.map(school => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button onClick={handleSaveSchool} title="Save">
                  <Save size={18} className="text-green-600 hover:text-green-700" />
                </button>
                <button onClick={() => setEditingSchool(false)} title="Cancel">
                  <X size={18} className="text-red-500 hover:text-red-600" />
                </button>
              </div>
            </div>
          ) : (
            <div className="truncate">{course.school}</div>
          )}
        </Section>

        {/* Enrollment Key */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ClipboardCopy size={14} />
            <span>Enrollment Key</span>
          </div>
          <Card className="bg-white dark:bg-sidebar shadow-sm rounded-lg">
            <CardContent className="p-3 text-sm font-medium flex items-center justify-between">
              {!editingKey ? (
                <>
                  <div className="truncate">{showKey ? course.enrollmentKey : "••••••••"}</div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowKey(!showKey)} title="Toggle Visibility">
                      {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button onClick={handleCopy} title="Copy">
                      {copied ? <Check size={18} className="text-green-500" /> : <ClipboardCopy size={18} />}
                    </button>
                    <button
                      onClick={() => {
                        setNewKey(course.enrollmentKey);
                        setEditingKey(true);
                      }}
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center w-full gap-3">
                  <input
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="flex-1 px-3 py-1 border rounded-md text-black dark:text-white dark:bg-gray-800"
                    placeholder="Enter new enrollment key"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveKey} title="Save">
                      <Save size={18} className="text-green-600 hover:text-green-700" />
                    </button>
                    <button onClick={() => setEditingKey(false)} title="Cancel">
                      <X size={18} className="text-red-500 hover:text-red-600" />
                    </button>
                  </div>
                </div>



              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-xl font-semibold">Enrolled Students</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog open={isAdding} onOpenChange={setIsAdding}>
                <DialogTrigger asChild>
                  <Button size="sm" className="shrink-0">
                    <Plus className="mr-2 h-4 w-4" /> Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enroll Student Manually</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Student email"
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                      type="email"
                    />
                    <Button 
                      onClick={handleManualEnroll}
                      disabled={!manualEmail.includes("@")}
                    >
                      Enroll Student
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Enrolled At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={student.status === 'ENROLLED' ? 'default' : 'destructive'}
                          className="capitalize"
                        >
                          {student.status.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(student.enrolledAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              {filteredStudents.length === 0 && (
                <div className="py-6 text-center text-muted-foreground">
                  {searchTerm ? "No matching students" : "No students enrolled yet"}
                </div>
              )}
            </CardContent>
          </Card>
        </div> {/* This closes the space-y-4 container */}
      </div> {/* This closes the space-y-6 container */}
    </div> 

  );


};



export default CourseSettings;