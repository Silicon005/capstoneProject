import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

interface Student {
  id: string;
  name: string;
  email: string;
}

interface TestDetails {
  id: string;
  name: string;
  totalMarks: number;
  createdAt: string;
  course: string;
  topic: string;
  studentsAttempted: {
    studentId: string;
    totalMarks: number;
    studentDetails: Student;
  }[];
  studentsNotAttempted: Student[];
  questions: {
    id: string;
    text: string;
    type: 'MCQ' | 'DIRECT_ANSWER';
    options: string[];
    correctAnswer: string;
    hints: string[];
    level: number;
  }[];
}

const TestPreview = () => {
  const { testId } = useParams<{ testId: string }>();
  const [testDetails, setTestDetails] = useState<TestDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/test/preview/${testId}`);
        setTestDetails(response.data.test);
      } catch (error) {
        console.error("Error fetching test details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [testId]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!testDetails) {
    return <div className="flex justify-center p-8">Test not found</div>;
  }

  // Calculate question type distribution
  const questionTypes = testDetails.questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-8 space-y-6">
      {/* Test Header */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <h1 className="text-3xl font-bold">{testDetails.name}</h1>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Course: {testDetails.course}
          </Badge>
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Topic: {testDetails.topic}
          </Badge>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Marks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testDetails.totalMarks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testDetails.studentsAttempted.length + testDetails.studentsNotAttempted.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Attempted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testDetails.studentsAttempted.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Not Attempted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testDetails.studentsNotAttempted.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Student Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Student Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Attempted Students Table */}
          <div>
            <h3 className="font-medium mb-2">Students Who Attempted ({testDetails.studentsAttempted.length})</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Marks Obtained</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testDetails.studentsAttempted.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell>{student.studentDetails.name}</TableCell>
                    <TableCell>{student.studentDetails.email}</TableCell>
                    <TableCell>{student.totalMarks}</TableCell>
                    <TableCell>
                      {((student.totalMarks / testDetails.totalMarks) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {testDetails.studentsAttempted.length === 0 && (
              <div className="text-gray-500 text-center py-4">
                No students have attempted this test yet
              </div>
            )}
          </div>

          {/* Not Attempted Students Table */}
          <div>
            <h3 className="font-medium mb-2">Students Who Haven't Attempted ({testDetails.studentsNotAttempted.length})</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testDetails.studentsNotAttempted.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Not Attempted</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {testDetails.studentsNotAttempted.length === 0 && (
              <div className="text-gray-500 text-center py-4">
                All enrolled students have attempted this test
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Type Distribution */}
          <div>
            <h3 className="font-medium mb-2">Question Types</h3>
            <div className="flex gap-4">
              {Object.entries(questionTypes).map(([type, count]) => (
                <div key={type} className="flex items-center gap-2">
                  <Badge variant="outline">{type}</Badge>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Distribution */}
          <div>
            <h3 className="font-medium mb-2">Difficulty Levels</h3>
            <div className="space-y-2">
              {testDetails.questions.map((question, index) => (
                <div key={question.id} className="flex items-center gap-4">
                  <span className="w-8">Q{index + 1}</span>
                  <Progress 
                    value={(question.level / 10) * 100}
                    className="h-2"
                    indicatorClassName={
                      question.level > 7 ? 'bg-red-500' :
                      question.level > 4 ? 'bg-yellow-500' : 'bg-green-500'
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Questions Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Correct Answer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testDetails.questions.map((question, index) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium">Q{index + 1}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {question.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      question.level > 7 ? 'bg-red-100 text-red-800' :
                      question.level > 4 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }>
                      Level {question.level}
                    </Badge>
                  </TableCell>
                  <TableCell>{question.correctAnswer}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Detailed Questions Accordion */}
          <div className="mt-6 space-y-4">
            {testDetails.questions.map((question, index) => (
              <Accordion type="single" collapsible key={question.id}>
                <AccordionItem value={question.id}>
                  <AccordionTrigger>
                    <div className="flex items-center space-x-4">
                      <span>Q{index + 1}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {question.text.substring(0, 50)}...
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pl-4">
                      <div>
                        <h4 className="font-medium mb-2">Question Text:</h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          {question.text}
                        </p>
                      </div>

                      {question.type === 'MCQ' && (
                        <div>
                          <h4 className="font-medium mb-2">Options:</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            {question.options.map((option, i) => (
                              <li
                                key={i}
                                className={
                                  option === question.correctAnswer
                                    ? 'text-green-600 dark:text-green-400 font-semibold'
                                    : 'text-gray-700 dark:text-gray-300'
                                }
                              >
                                {option}
                                {option === question.correctAnswer && (
                                  <span className="ml-2">Correct Answer</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {question.type === 'DIRECT_ANSWER' && (
                        <div>
                          <h4 className="font-medium mb-2">Correct Answer:</h4>
                          <p className="text-green-600 dark:text-green-400 font-semibold">
                            {question.correctAnswer}
                          </p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium mb-2">Hints:</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          {question.hints.map((hint, i) => (
                            <li key={i} className="text-gray-600 dark:text-gray-400">
                              {hint}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPreview;