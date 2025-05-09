"use client";
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BookOpen, ChevronRight, PlusCircle, Edit, Trash } from "lucide-react"; // Import Trash icon
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import TimeSettings from "./TimeSettings"; 
import axios from 'axios';

export default function CreateTest() {
  const [currentPage, setCurrentPage] = useState(1);
  const [testName, setTestName] = useState("");
  const navigate = useNavigate();
  const questionsPerPage = 5;
  interface Question {
    questionText: string;
    options: string[];
    hints: string[];
    answer: string;
  }

  const [questions, setQuestions] = useState<Question[]>([]);
  const [editQuestion, setEditQuestion] = useState<{ questionText: string; options: string[]; hints: string[]; answer: string; index: number } | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get('topicId');
  const [courseId, setCourseId] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState(90); 
  
  const handleRouteChange = (nextRoute) => {
    const validRoutes = [
      `/teacher-dashboard/create-test-manually?topicId=${topicId}`,
      `/teacher-dashboard/generate-question?topicId=${topicId}`,
      `/teacher-dashboard/question-bank`
    ];
    
    if (!validRoutes.includes(nextRoute)) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave this page?");
      if (confirmLeave) {
        localStorage.removeItem("questions");
        setQuestions([]);
        setTestName("");
        setStartTime(null);
        setEndTime(null);
        setDuration(90);
        navigate(nextRoute); 
      }
    } else {
      navigate(nextRoute); 
    }
  }

  const handleButtonClick = (route) => {
    handleRouteChange(route);
  }

  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
    setQuestions(storedQuestions);
  }, []);

  useEffect(() => {
    const fetchCourseAndTeacher = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/getCourse/${topicId}`);
        const data = response.data;
        if (data && data.id && data.teacherId) {
          setCourseId(data.id);
          setTeacherId(data.teacherId);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    
    if (topicId) {
      fetchCourseAndTeacher();
    }
  }, [topicId]);

  const handleCreateTest = async () => {
    try {
      const totalMarks = questions.length * 5; 
      console.log(startTime);
      
      const response = await axios.post("http://localhost:3000/api/createQuestions", {
        name: testName,
        topicId,
        totalMarks,
        startTime,
        endTime,
        duration,
        questions: questions.map(question => ({
          questionText: question.questionText,
          type: question.type,
          options: question.options,
          hints: question.hints,
          answer: question.answer,
        })),
        teacherId,
        courseId,
      });

      
      alert("Test created successfully!");

      localStorage.removeItem("questions");
      setQuestions([]);
      setTestName("");
      setCurrentPage(1);
      setExpandedQuestionIndex(null);
      setEditQuestion(null);
      setOpenDialog(false);
      navigate(`/teacher/courses/${courseId}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create test");
    }
  };

  const handleEditQuestion = (question: Question, index: number) => {
    setEditQuestion({ ...question, index });
    setOpenDialog(true);
  };

  const handleSaveChanges = () => {
    setQuestions(prevQuestions => {
      const newQuestions = [...prevQuestions];
      newQuestions[editQuestion.index] = {
        questionText: editQuestion.questionText,
        options: editQuestion.options,
        hints: editQuestion.hints,
        answer: editQuestion.answer
      };
      localStorage.setItem("questions", JSON.stringify(newQuestions));
      return newQuestions;
    });
    setOpenDialog(false);
  };

  const handleDeleteQuestion = (index: number | null) => {
    setQuestions(prevQuestions => {
      const newQuestions = prevQuestions.filter((_, i) => i !== index);
      localStorage.setItem("questions", JSON.stringify(newQuestions));

      if (expandedQuestionIndex === index) {
        setExpandedQuestionIndex(null);
      } else if (index !== null && expandedQuestionIndex !== null && expandedQuestionIndex > index) {
        setExpandedQuestionIndex(expandedQuestionIndex - 1);
      }

      return newQuestions;
    });
  };

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage);

  const handleInputChange = (field: string, value: string | string[]) => {
    setEditQuestion(prev => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <SidebarInset>
      <div className="px-20 py-4 min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <div className="w-full">
          <Card className="bg-gray-100 dark:bg-sidebar mt-6">
            <CardContent>
              <div className="my-6">
                <div className="mb-4">
                  <label className="font-semibold text-lg">Test Name:</label>
                  <Input
                    value={testName}
                    placeholder={"Enter test name"}
                    type='text'
                    onChange={(e) => setTestName(e.target.value)}
                    className="mt-2 w-150 border px-3 py-2 rounded-md"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">📚 Questions</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="w-4 h-4 mr-2" /> Create Question
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Question</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 p-4">
                        <Button className="w-full" onClick={() => handleButtonClick(`/teacher-dashboard/create-test-manually?topicId=${topicId}`)}>
                          Add Question Manually
                        </Button>
                        <Button className="w-full" onClick={() => handleButtonClick(`/teacher-dashboard/generate-question?topicId=${topicId}`)}>
                          Generate Question
                        </Button>
                        <Button className="w-full" onClick={() => handleButtonClick("/teacher-dashboard/question-bank")}>
                          Choose from Question Bank
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4 mt-6">
                  {currentQuestions.filter((question) => question.topicId === topicId).map((question, qIndex) => (
                    <Collapsible key={qIndex} className="border rounded-lg shadow-md">
                      <CollapsibleTrigger className="w-full block group/collapsible" onClick={() => setExpandedQuestionIndex(expandedQuestionIndex === qIndex ? null : qIndex)}>
                        <div className="w-full px-4 py-3 bg-sidebar-accent hover:bg-sidebar rounded-lg flex items-center gap-3 border">
                          <BookOpen fill="black" className="w-[20px]" />
                          <p className="font-semibold">Question {(currentPage - 1) * questionsPerPage + qIndex + 1}</p>
                          {expandedQuestionIndex === qIndex && (
                            <>
                              <Edit
                                className="w-4 h-4 cursor-pointer text-blue-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditQuestion(question, (currentPage - 1) * questionsPerPage + qIndex);
                                }}
                              />
                              <Trash
                                className="w-4 h-4 cursor-pointer text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm("Are you sure you want to delete this question?")) {
                                    handleDeleteQuestion((currentPage - 1) * questionsPerPage + qIndex);
                                  }
                                }}
                              />
                            </>
                          )}
                          <ChevronRight className="w-[20px] ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-6 py-4 bg-white dark:bg-gray-900 border rounded-md">
                          <p className="text-lg font-semibold">Question: {question.questionText}</p>
                          <p className="mt-2"><strong>Options:</strong></p>
                          <ul className="list-disc pl-6">
                            {question.options.map((option, index) => (
                              <li key={index} className="py-1">{option}</li>
                            ))}
                          </ul>
                          <p className="mt-2"><strong>Hints:</strong></p>
                          <ul className="list-disc pl-6 text-sm italic text-gray-600">
                            {question.hints.map((hint, index) => (
                              <li key={index} className="py-1">{hint}</li>
                            ))}
                          </ul>
                          <p className="text-green-600 font-semibold mt-2"><strong>Correct Answer:</strong> {question.answer}</p>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>

                <TimeSettings
                  startTime={startTime} setStartTime={setStartTime}
                  endTime={endTime} setEndTime={setEndTime}
                  duration={duration} setDuration={setDuration}
                />

                <div className="flex justify-center mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        {currentPage > 1 && (
                          <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                        )}
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink onClick={() => setCurrentPage(index + 1)} className={currentPage === index + 1 ? "font-bold" : ""}>
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        {currentPage < totalPages && (
                          <PaginationNext onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
                        )}
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => handleButtonClick(-1)}>
                  Go Back
                </Button>
                <Button className="bg-green-600 text-white hover:bg-green-700" onClick={handleCreateTest}>
                  Save & Create Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog for editing the question */}
      <div className='w-full'>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="w-full">
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
            </DialogHeader>
            {editQuestion && (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  <Input
                    type="text"
                    value={editQuestion.questionText}
                    onChange={(e) => handleInputChange("questionText", e.target.value)}
                    placeholder="Question Text"
                    className="w-full"
                  />
                  <div>
                    <strong>Options:</strong>
                    {editQuestion.options.map((option, i) => (
                      <Input
                        key={i}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...editQuestion.options];
                          newOptions[i] = e.target.value;
                          handleInputChange("options", newOptions);
                        }}
                        placeholder={`Option ${i + 1}`}
                        className="mt-2 w-full"
                      />
                    ))}
                  </div>
                  <div>
                    <strong>Correct Answer:</strong>
                    <Input
                      type="text"
                      value={editQuestion.answer}
                      onChange={(e) => handleInputChange("answer", e.target.value)}
                      placeholder="Correct Answer"
                      className="mt-2 w-full"
                    />
                  </div>
                  <div>
                    <strong>Hints:</strong>
                    {editQuestion.hints.map((hint, i) => (
                      <Input
                        key={i}
                        value={hint}
                        onChange={(e) => {
                          const newHints = [...editQuestion.hints];
                          newHints[i] = e.target.value;
                          handleInputChange("hints", newHints);
                        }}
                        placeholder={`Hint ${i + 1}`}
                        className="mt-2 w-full"
                      />
                    ))}
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button onClick={handleSaveChanges}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  );
}