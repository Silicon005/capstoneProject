import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function CreateTestManually() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const topicId = searchParams.get('topicId');
    const [questions, setQuestions] = useState([
        { questionText: "", type: "mcq", options: ["", "", "", ""], answer: "", hints: [""]  }
    ]);

    const validateQuestions = () => {
        for (const question of questions) {
            if (question.type === "mcq") {
                const optionsSet = new Set();

                // Check for duplicate options
                for (const option of question.options) {
                    if (option) {
                        if (optionsSet.has(option)) {
                            alert("Duplicate options found!");
                            return false; // Invalid if duplicates exist
                        }
                        optionsSet.add(option);
                    }
                }

                // Check if correct answer matches one of the options
                if (!optionsSet.has(question.answer)) {
                    alert("Correct answer must match one of the options!");
                    return false; // Invalid if no match for answer
                }
            }
        }
        return true; // Valid questions
    };

    const handleSubmit = async () => {
        if (!validateQuestions()) {
            return; // Stop submission if validations fail
        }

        // Fetch previously stored questions from local storage
        const existingQuestions = JSON.parse(localStorage.getItem("questions") || "[]");

        // Combine existing questions with new ones
        
        
        const questionsWithTopicId = questions.map(question => ({
            ...question,
            topicId: topicId,
        }));
        const combinedQuestions = [...existingQuestions, ...questionsWithTopicId];

        // Save the combined questions to local storage
        localStorage.setItem("questions", JSON.stringify(combinedQuestions));

        // Navigate back to CreateTest page with the topicId
        navigate(`/teacher-dashboard/create-test?topicId=${topicId}`);
    };
    
    const handleQuestionChange = (index: number, value: string) => {
        setQuestions(prevQuestions =>
            prevQuestions.map((q, i) => 
                i === index ? { ...q, questionText: value } : q
            )
        );
    };

    const handleTypeChange = (index: number, type: string) => {
        setQuestions(prevQuestions =>
            prevQuestions.map((q, i) => {
                if (i === index) {
                    return {
                        ...q,
                        type: type,
                        options: type === "direct" ? [] : ["", "", "", ""],
                        answer: "",
                    };
                }
                return q;
            })
        );
    };

    const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
        setQuestions(prevQuestions =>
            prevQuestions.map((q, i) => {
                if (i === qIndex) {
                    const newOptions = [...q.options];
                    newOptions[optIndex] = value;
                    return { ...q, options: newOptions };
                }
                return q;
            })
        );
    };

    const handleAnswerChange = (index: number, value: string) => {
        setQuestions(prevQuestions =>
            prevQuestions.map((q, i) => 
                i === index ? { ...q, answer: value } : q
            )
        );
    };

    const handleHintChange = (qIndex: number, hintIndex: number, value: string) => {
        setQuestions(prevQuestions =>
            prevQuestions.map((q, i) => {
                if (i === qIndex) {
                    const newHints = [...q.hints];
                    newHints[hintIndex] = value;
                    return { ...q, hints: newHints };
                }
                return q;
            })
        );
    };

    const addOption = (qIndex: number) => {
        setQuestions(prevQuestions =>
            prevQuestions.map((q, i) => {
                if (i === qIndex) {
                    return { ...q, options: [...q.options, ""] };
                }
                return q;
            })
        );
    };

    const removeOption = (qIndex: number, optIndex: number) => {
        setQuestions(prevQuestions =>
            prevQuestions.map((q, i) => {
                if (i === qIndex && q.options.length > 2) {
                    const newOptions = q.options.filter((_, idx) => idx !== optIndex);
                    return { ...q, options: newOptions };
                }
                return q;
            })
        );
    };

    const addHint = (qIndex: number) => {
        setQuestions(prevQuestions =>
            prevQuestions.map((q, i) => {
                if (i === qIndex && q.hints.length < 4) {
                    return { ...q, hints: [...q.hints, ""] };
                }
                return q;
            })
        );
    };

    const removeHint = (qIndex: number, hintIndex: number) => {
        setQuestions(prevQuestions =>
            prevQuestions.map((q, i) => {
                if (i === qIndex) {
                    const newHints = q.hints.filter((_, idx) => idx !== hintIndex);
                    return { ...q, hints: newHints };
                }
                return q;
            })
        );
    };

    const addQuestion = () => {
        setQuestions(prevQuestions => [
            ...prevQuestions,
            { questionText: "", type: "mcq", options: ["", "", "", ""], answer: "", hints: [""] }
        ]);
    };

    const removeQuestion = (index: number) => {
        if (questions.length > 1) {
            setQuestions(prevQuestions => prevQuestions.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="p-10 min-h-screen bg-white text-black dark:bg-black dark:text-white">
            <Card className="max-w-2xl mx-auto">
                <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Generate a New Test</h2>
                    {questions.map((q, qIndex) => (
                        <div key={`question-${qIndex}`} className="mb-6 border p-4 rounded-lg">
                            <h3 className="text-lg font-medium mb-2">Question {qIndex + 1}</h3>
                            <Select value={q.type} onValueChange={(value) => handleTypeChange(qIndex, value)}>
                                <SelectTrigger className="mb-4">
                                    <SelectValue placeholder="Select Question Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Select Type Questions</SelectLabel>
                                        <SelectItem value="mcq">MCQ</SelectItem>
                                        <SelectItem value="direct">Direct Answer</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Input 
                                type="text" 
                                placeholder="Enter question" 
                                value={q.questionText} 
                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)} 
                                className="mb-4" 
                            />

                            {q.type === "direct" ? (
                                <Input 
                                    type="text" 
                                    placeholder="Enter correct answer" 
                                    value={q.answer} 
                                    onChange={(e) => handleAnswerChange(qIndex, e.target.value)} 
                                    className="mb-2" 
                                />
                            ) : (
                                <>
                                    {q.options.map((option, optIndex) => (
                                        <div key={`option-${qIndex}-${optIndex}`} className="flex gap-2 items-center">
                                            <Input 
                                                type="text" 
                                                placeholder={`Option ${optIndex + 1}`} 
                                                value={option} 
                                                onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)} 
                                                className="mb-2 flex-1" 
                                            />
                                            <Button variant="destructive" onClick={() => removeOption(qIndex, optIndex)}>✖</Button>
                                        </div>
                                    ))}
                                    <Button className="mt-2" onClick={() => addOption(qIndex)}>Add Option</Button>
                                </>
                            )}

                            <h4 className="mt-4">Hints (Max 4)</h4>
                            {q.hints.map((hint, hintIndex) => (
                                <div key={`hint-${qIndex}-${hintIndex}`} className="flex gap-2 items-center">
                                    <Input 
                                        type="text" 
                                        placeholder={`Hint ${hintIndex + 1}`} 
                                        value={hint} 
                                        onChange={(e) => handleHintChange(qIndex, hintIndex, e.target.value)} 
                                        className="mb-2 flex-1" 
                                    />
                                    <Button variant="destructive" onClick={() => removeHint(qIndex, hintIndex)}>✖</Button>
                                </div>
                            ))}
                            {q.type === "mcq" && (
                                <>
                                    <h4 className="mt-4">Correct Answer</h4>
                                    <div>
                                        <Input 
                                            type="text" 
                                            placeholder="Enter correct answer" 
                                            value={q.answer} 
                                            onChange={(e) => handleAnswerChange(qIndex, e.target.value)} 
                                            className="mb-2" 
                                        />
                                    </div>
                                </>
                            )}
                            <Button className="mt-2" onClick={() => addHint(qIndex)}>Add Hint</Button>
                            <Button variant="destructive" className="ml-2 mt-4" onClick={() => removeQuestion(qIndex)}>Delete Question</Button>
                        </div>
                    ))}

                    <Button className="w-full mt-4" onClick={addQuestion}>Add Question</Button>
                    <Button variant="outline" className="mt-4 w-full" onClick={() => navigate(-1)}>Go Back</Button>
                    <Button className="w-full mt-4" onClick={handleSubmit}>Submit</Button>
                </CardContent>
            </Card>
        </div>
    );
}