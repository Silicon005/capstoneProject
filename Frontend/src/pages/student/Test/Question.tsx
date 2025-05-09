import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from '@/components/ui/separator';
import { Lightbulb } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
  import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card";
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
    
  
  


// Interface for Question
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
interface QuestionProp{
    _id: number;
    question: string;
    options: Options;
    correctOption: string;
    hints:Hints;
}
interface QuestionComponentProps {
    Question?: QuestionProp;
    currentQuestion: number;
    answersOfQuestions: { [key: number]: string };
    setAnswersOfQuestions: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
    statusOfQuestion: { [key: number]: number };
    setStatusOfQuestion: React.Dispatch<React.SetStateAction<{ [key: number]: number }>>;
}


const Question: React.FC<QuestionComponentProps>  = ({
    Question,
    currentQuestion, 
    answersOfQuestions, 
    setAnswersOfQuestions, 
    statusOfQuestion, 
    setStatusOfQuestion
}) => {

    const [useHints, setUseHints] = useState<boolean>(false);

    const hints = {
        hint1: -1/4,
        hint2: -1/2,
        hint3: -3/4,
    }

    useEffect(()=>{
        setUseHints(false);

    },[Question]);


    useEffect(() => {
        if (Question) {
            setStatusOfQuestion((prevStatus) => ({
                ...prevStatus,
                [Question._id]: answersOfQuestions[Question._id] ? 1 : 3, 
            }));
        }
    }, [Question, setStatusOfQuestion, answersOfQuestions]);


    const handleOptionSelect = (selectedOption: string) => {
        if (Question) {
            const questionId = Question._id;

            // Update selected answer
            setAnswersOfQuestions((prev) => ({
                ...prev,
                [questionId]: selectedOption,
            }));

            // Update status based on answer presence
            setStatusOfQuestion((prev) => ({
                ...prev,
                [questionId]: selectedOption ? 1 : 3, // 1 = Answered, 3 = Unanswered
            }));
        }
    };


  return (
    <div className='p-6'>
        {
            Question &&
            <>
                <h2 className="text-lg font-semibold">{`Question ${currentQuestion}`}</h2>
                <Separator className='my-3' />

                <div className="my-2 text-lg">{Question.question}</div>
                
                <RadioGroup className="px-2 space-y-3" value={answersOfQuestions[Question._id]} onValueChange={handleOptionSelect}>
                    {Object.entries(Question.options).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-3">
                            <RadioGroupItem value={key} id={key} />
                            <Label htmlFor={key} className="text-gray-700">
                                {value as string}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>

                <div className="py-6">
                    <div className='flex gap-3'>
                        <h2 className="text-lg font-semibold">Hints</h2>
                        <HoverCard>
                            <HoverCardTrigger> <Lightbulb fill="yellow" onClick={()=>{setUseHints(!useHints)}}/></HoverCardTrigger>
                            <HoverCardContent className='px-2 p-1 w-auto'>
                                Use Hints
                            </HoverCardContent>
                        </HoverCard>
                    </div>

                    
                    {
                        useHints &&
                        <div className="list-none mt-2 ml-2 text-gray-700 space-y-2">

                            {
                                Object.keys(Question.hints).map((key, index) => (
                                    <Collapsible key={index}>
                                        <div className="px-6 max-w-[500px] py-2 border shadow-sm rounded-sm flex justify-between">
                                            <p>Hint {index + 1}</p>


                                            <AlertDialog>
                                                <AlertDialogTrigger>+</AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action will decrease your Marks by {hints[key as keyof typeof hints]}.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <CollapsibleTrigger asChild>
                                                        <span><AlertDialogAction>Continue</AlertDialogAction></span>
                                                    </CollapsibleTrigger>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                        </div>
                                        <CollapsibleContent className="px-2 py-1">
                                            {Question.hints[key as keyof Hints]} {/* Dynamic hint access */}
                                        </CollapsibleContent>
                                    </Collapsible>
                                ))
                            }

                        </div>
                    }
                </div>
            </>
        }
    </div>
  )
}

export default Question;