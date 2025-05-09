import React, {useState, useEffect} from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

// Import Components
import RemainingTime from './Timer';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/Spinner/Spinner";
import Question from "./Question";


// Interface for Test
interface Options{
  A:string;
  B:string;
  C:string;
  D:string;
}
interface Hints{
  hint1:string;
  hint2:string;
  hint3:string;
}
interface Questions{
  _id: number;
  question: string;
  options: Options;
  correctOption: string;
  hints:Hints;
}
interface Test {
  course: string;
  chapter: string;
  topicName: string;
  level: string;
  questions: Questions[];
}

const TestPage: React.FC = () => {
  const {testID} = useParams();
  console.log(testID);


  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [Test, setTest] = useState<Test>();
  const [Loading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);


  const [answersOfQuestions, setAnswersOfQuestions] = useState<{ [key: number]: string }>({});
  const [statusOfQuestion, setStatusOfQuestion] = useState<{ [key: number]: number }>({});


  {/* Guide for Status of Questions
    1   ===>    Answered
    2   ===> Marked for review
    3   ===> Unanswered
    4   ===> unvisited
    */}


  useEffect(() =>{

    setIsLoading(true)
    const testData = {
      level: "Level 1",
      course: "Data Structure and Algorithms",
      chapter: "Arrays",
      topicName: "Basic Concepts",
      questions: [
        {
          _id: 1,
          question: "What is the time complexity to access an element in an array by index?",
          options: {
            A: "O(1)",
            B: "O(n)",
            C: "O(log n)",
            D: "O(n log n)"
          },
          correctOption: "A",
          hints: {
            hint1: "Think about how direct indexing works.",
            hint2: "Array elements are stored in contiguous memory.",
            hint3: "Random access in an array is efficient."
          }
        },
        {
          _id: 2,
          question: "Which of the following best defines an array?",
          options: {
            A: "A collection of different data types",
            B: "A collection of elements stored in a contiguous memory location",
            C: "A non-linear data structure",
            D: "A dynamic data structure"
          },
          correctOption: "B",
          hints: {
            hint1: "Think about how arrays are stored in memory.",
            hint2: "Arrays provide indexed access.",
            hint3: "Elements of an array must be of the same type."
          }
        },
        {
          _id: 3,
          question: "What is the worst-case time complexity of linear search in an array?",
          options: {
            A: "O(1)",
            B: "O(log n)",
            C: "O(n)",
            D: "O(n log n)"
          },
          correctOption: "C",
          hints: {
            hint1: "Think about how many elements we might need to check.",
            hint2: "Linear search examines elements one by one.",
            hint3: "Worst-case occurs when the element is at the end or not present."
          }
        },
        {
          _id: 4,
          question: "Which sorting algorithm has the best average-case time complexity?",
          options: {
            A: "Bubble Sort",
            B: "Selection Sort",
            C: "Merge Sort",
            D: "Insertion Sort"
          },
          correctOption: "C",
          hints: {
            hint1: "Divide and conquer approach.",
            hint2: "It uses recursion.",
            hint3: "Best average-case complexity is O(n log n)."
          }
        },
        {
          _id: 5,
          question: "What is the advantage of using an array over a linked list?",
          options: {
            A: "Faster random access",
            B: "Efficient insertions and deletions",
            C: "No memory wastage",
            D: "Better space complexity"
          },
          correctOption: "A",
          hints: {
            hint1: "Think about index-based access.",
            hint2: "Arrays provide O(1) access time.",
            hint3: "Linked lists require traversal for access."
          }
        },
      ]
    };

    setTest(testData);

    // Initialize answersOfQuestions and sttus of Question
    const initialAnswers: { [key: number]: string } = {};
    const initialStatus: { [key: number]: number } = {};

    testData.questions.forEach((q) => {
      initialAnswers[q._id] = ""; // No answer selected initially
      initialStatus[q._id] = 4; // Default status: Unanswered
    });

    setAnswersOfQuestions(initialAnswers);
    setStatusOfQuestion(initialStatus);
    
    setIsLoading(false);

  }, []);



  // Submit Handller
  const submitTestHandller = async() =>{
    if(isSubmitted){
      return;
    }

    setIsSubmitted(true);

    console.log(answersOfQuestions);
    console.log(statusOfQuestion);

    setIsSubmitted(false);
  }

  
  // Include into Marked for review
  function handleMarkForReview(questionId: number) {
    setStatusOfQuestion((prevStatus) => ({
      ...prevStatus,
      [questionId]: 2, 
    }));
  }

  // Remove from review
  function removeFromReview(questionId: number) {
    setStatusOfQuestion((prevStatus) => ({
      ...prevStatus,
      [questionId]: answersOfQuestions[questionId] === "" ? 3 : 1, // Unanswered (3) if empty,
    }));
  }


  // Clear the option
  function clearQuestionOption(questionId: number){
    setAnswersOfQuestions((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: "", // Clear the answer
    }));
  
    setStatusOfQuestion((prevStatus) => ({
      ...prevStatus,
      [questionId]: 3, // Mark as Unanswered
    }));
  }
   
  

  

  return (

    <div className="h-screen flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 w-full h-[40px] p-[5px] bg-sidebar border-b z-30 flex gap-3 justify-center">
        {
          !Loading && Test &&
          <>
            <Badge>{Test.level}</Badge>
            <h1 className="text-xl font-bold text-center">{Test.course} - {Test.chapter}</h1>
          </> 
        }
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-8 flex-grow" style={{ height: "calc(100vh - 40px)" }}>
        
        {/* Left Section (Scrollable) */}
        <div className="col-span-6 overflow-hidden" style={{ height: "calc(100vh - 40px)" }}>

          <div className="sticky w-full h-[50px] px-6 bg-sidebar top-0 z-10 flex justify-between overflow-hidden">
            {
              Test &&
              <>
                <div className="h-full flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Questions: </h2>
                  <Button className="rounded-full">{currentQuestion}/{Test?.questions.length}</Button>
                </div>
                <div className="h-full flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Marking Scheme: </h2>
                  <Button className="rounded-full">+1</Button>
                  {/* <Button className="rounded-full">0</Button> */}
                </div>
              </>
            }
          </div>

          <div style={{ height: "calc(100vh - 50px)" }}>
            <ScrollArea className="w-full h-full pb-[100px]">
              
              {
                Loading && Test ? 
                <Spinner/>
                :
                <Question 
                  Question={Test?.questions[currentQuestion-1]} 
                  currentQuestion={currentQuestion}
                  answersOfQuestions={answersOfQuestions}
                  setAnswersOfQuestions={setAnswersOfQuestions}
                  statusOfQuestion={statusOfQuestion}
                  setStatusOfQuestion={setStatusOfQuestion}
                />
              } 
            </ScrollArea>
          </div>


          <div className="sticky bottom-0 w-full py-2 px-6 bg-sidebar flex justify-between gap-2">

            <div className="flex gap-3">
              {
                !Loading && Test &&
                
                <>
                  <Button 
                    className={`rounded-full bg-blue-500 hover:bg-blue-600`}
                    onClick={
                      async()=>{
                        clearQuestionOption(Test.questions[currentQuestion-1]._id);
                      }
                    }
                  >
                    Clear
                  </Button>

                  <Button 
                    className={`rounded-full bg-yellow-500 hover:bg-yellow-600`}
                    onClick={
                      async() => {
                      handleMarkForReview(Test.questions[currentQuestion-1]._id)
                    }
                    }
                    >
                    Mark for Review
                  </Button>

                  <Button 
                    className={`rounded-full bg-green-500 hover:bg-green-600`}
                    onClick={ 
                      async() => {
                        removeFromReview(Test.questions[currentQuestion-1]._id)
                      }
                    }
                    >
                    Remove from Review
                  </Button>

                  <Button 
                    className={`rounded-l-full ${currentQuestion === 1 ?"bg-[#666] hover:bg-[#666]":""}`}
                    onClick={ async()=>{
                        if(currentQuestion != 1)
                        setCurrentQuestion(currentQuestion-1);
                      }
                    }
                  >
                    Previous
                  </Button>

                  <Button 
                    className={`rounded-r-full ${currentQuestion === Test.questions.length?"bg-[#666] hover:bg-[#666]":""}`}
                    onClick={async()=>{


                      if(currentQuestion !== Test.questions.length)
                      setCurrentQuestion(currentQuestion+1);
                    }}
                  >
                    Next
                  </Button>
                </>            
              }
            </div>

            {
              !Loading && Test &&
              <>
                {
                  Test.questions.length === currentQuestion &&
                  <Button 
                    className={`rounded-full ${isSubmitted ?"bg-[#666] hover:bg-[#666]":""}`}
                    onClick={submitTestHandller}
                  >
                    Submit
                  </Button>
                }
              </>
            }

          </div>
        </div>

        {/* Right Section (Static) */}
        <div className="col-span-2 bg-sidebar h-full overflow-hidden" style={{ height: "calc(100vh - 50px)"}}>
          <ScrollArea className="w-full h-full">
            {/* Timer */}
            <RemainingTime duration={5} submitTestHandller={submitTestHandller}/>

            <Separator />

            {/* Question Navigation */}
            <div className="px-4 py-3">
              <h2 className="text-lg font-semibold">Questions:</h2>
              <div className="my-2 flex gap-2 flex-wrap">
                {
                  !Loading && Test &&
                  <>
                    {
                    Test.questions.map((question, index) => (
                      <Badge
                        key={index}
                        className={`w-[45px] h-[45px] text-lg flex justify-center items-center cursor-pointer transition-colors ${
                          currentQuestion === index+1
                          ?
                          "bg-blue-500 hover:bg-blue-600"
                          :
                          statusOfQuestion[question._id]=== 2
                          ?
                          "bg-yellow-500 hover:bg-yellow-600"
                          :
                          statusOfQuestion[question._id]=== 1
                          ?
                          "bg-green-500 hover:bg-green-600"
                          :
                          statusOfQuestion[question._id]=== 3
                          ?
                          "bg-red-500 hover:bg-red-600"
                          :
                          ""


                          
                        }`}
                        onClick={() => setCurrentQuestion(index+1)} 
                      >
                        {index + 1}
                      </Badge>
                    ))}
                  </>
                }
              </div>
            </div>

            {/* Coloring Schema */}
            <div className="px-4 pb-3">
              <h2 className="text-lg font-semibold">Coloring Schema of Question Boxes </h2>
              <div className="flex flex-wrap space-y-2 mt-2">
                
                <div className="w-[150px] flex items-center space-x-2">
                  <Badge className="w-[30px] h-[30px] bg-blue-500 hover:bg-blue-600"></Badge>
                  <span>Current</span>
                </div>

                <div className="w-[150px] flex items-center space-x-2">
                  <Badge className="w-[30px] h-[30px] bg-green-500 hover:bg-green-600"></Badge>
                  <span>Answered</span>
                </div>

                <div className="w-[150px] flex items-center space-x-2">
                  <Badge className="w-[30px] h-[30px] bg-red-500 hover:bg-red-600"></Badge>
                  <span>Not Answerd</span>
                </div>

                <div className="w-[150px] flex items-center space-x-2">
                  <Badge className="w-[30px] h-[30px] bg-[#333]"></Badge>
                  <span>Unanswered</span>
                </div>

                <div className="w-[150px] flex items-center space-x-2">
                  <Badge className="w-[30px] h-[30px] bg-yellow-500 hover:bg-yellow-600"></Badge>
                  <span>Marked for Review</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="px-4 py-3">
              {/* Heading */}
              <h2 className="text-xl font-semibold mb-4">
                Instructions to Use Hints
              </h2>

              {/* Hint Instructions Table */}
              <div className="space-y-2">
                {/* Hint 1 */}
                <div className="flex justify-between items-center px-3 py-2 border shadow-sm rounded-sm">
                  <span className="font-semibold">Use Hint 1</span>
                  <span className="text-red-600 font-semibold">-1/4 Marks</span>
                </div>

                {/* Hint 2 */}
                <div className="flex justify-between items-center px-3 py-2 border shadow-sm rounded-sm">
                  <span className="font-semibold">Use Hint 2</span>
                  <span className="text-red-600 font-semibold">-1/2 Marks</span>
                </div>

                {/* Hint 3 */}
                <div className="flex justify-between items-center px-3 py-2 border shadow-sm rounded-sm">
                  <span className="font-semibold">Use Hint 3</span>
                  <span className="text-red-600 font-semibold">-3/4 Marks</span>
                </div>
              </div>

              {/* Additional Note */}
              <p className="mt-2 text-sm">
                Note: Using hints will deduct marks as shown above. Use them wisely!
              </p>
            </div>
          </ScrollArea>
        </div>

      </div>

    </div>
  );
};

export default TestPage;