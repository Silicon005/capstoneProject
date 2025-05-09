import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GenerateQuestion() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get('topicId');
  const [bloomLevel, setBloomLevel] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState("");
  const [addedQuestions, setAddedQuestions] = useState<any[]>([]);
  const navigate = useNavigate();
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());

  const handleGenerate = async () => {
    if (input.trim() === "" || bloomLevel === "") return;

    setLoading(true);
    setOutput(null);

    const myHeaders = new Headers({
      "Content-Type": "application/json",
      "Authorization": `Bearer sk-fab29efa4a764e269defd179513cbdff`, 
    });

    const raw = JSON.stringify({
      question: input,
      model: "aicon-v4-large-160824",
      randomness: 0.5,
      stream_data: false,
      bloom_level: bloomLevel,
      number_of_questions: numberOfQuestions,
      training_data: `
      You are an AI assistant specialized in question generation. If the question is not related to engineering topics, please return an error. 
      Based on the given topic of engineering across all branches (computer science, mechanical, chemical, civil, electronics, and telecommunication), generate:
      - Multiple-choice questions (MCQs) with four answer options, and mark the correct one.
      - Direct question-answer format if needed, with the answer being concise (e.g., one word).
      - Provide 4 hints for each question to help the user understand the context or arrive at the answer.
      - Ensure the questions are appropriate for the Bloom's Taxonomy level: ${bloomLevel}, and generate only the number of questions in the range ${numberOfQuestions}.
      
      Response format:
      [{ "type": "MCQ/Direct", "question": "...", "options": ["..."], "correct_answer": "...", "answer": "...", "hints": ["Hint 1", "Hint 2", "Hint 3", "Hint 4"] }]`,
      response_type: "json",
    });

    try {
      const response = await fetch("https://api.worqhat.com/api/ai/content/v4", {
        method: "POST",
        headers: myHeaders,
        body: raw,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      formatOutput(responseData);

    } catch (error) {
      console.error("Fetch error:", error);
      setOutput("Error fetching response.");
    } finally {
      setLoading(false);
    }
  };

  const formatOutput = (data: any) => {
    try {
      const parsedContent = JSON.parse(data.content);
      const formattedQuestions = parsedContent.map((question: any, index: number) => ({
        ...question,
        index,
      }));

      setOutput(formattedQuestions);
    } catch (error) {
      console.error("Error parsing response content:", error);
      setOutput("Error parsing response content.");
    }
  };

  const handleCheckboxChange = (index: number) => {
    const updatedSelection = new Set(selectedQuestions);
    if (updatedSelection.has(index)) {
      updatedSelection.delete(index);
    } else {
      updatedSelection.add(index);
    }
    setSelectedQuestions(updatedSelection);
  };

  const handleSelectAll = () => {
    if (selectedQuestions.size === output.length) {
      setSelectedQuestions(new Set());
    } else {
      const allIndices = new Set(output.map((_, index) => index));
      setSelectedQuestions(allIndices);
    }
  };

  const handleSave = () => {
    const selected = Array.from(selectedQuestions);
    const questionsToSave = selected.map((index) => output[index]);
    
    const formattedData = questionsToSave.map((question) => ({
      questionText: question.question,
      type: question.type === "MCQ" ? "mcq" : "direct" ,
      options: question.type === "MCQ" ? question.options : [],
      answer: question.type === "MCQ" ? question.correct_answer : question.answer,
      hints: question.hints,
      topicId: topicId,
    }));

    // Save formattedData to local storage or handle as necessary
    const existingQuestions = JSON.parse(localStorage.getItem("questions") || '[]');
    localStorage.setItem("questions", JSON.stringify([...existingQuestions, ...formattedData]));

    console.log(JSON.stringify(formattedData, null, 2));
    setAddedQuestions((prev) => [...prev, ...questionsToSave]);
    setSelectedQuestions(new Set()); 
    navigate(`/teacher-dashboard/create-test?topicId=${topicId}`);
  };
  

  return (
    <div className="p-10 min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Generate New Questions</h2>
          <Select value={numberOfQuestions} onValueChange={setNumberOfQuestions}>
            <SelectTrigger className="mb-4">
              <SelectValue placeholder="Select number of questions" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Number of Questions</SelectLabel>
                <SelectItem value="2-4">2-4 Questions</SelectItem>
                <SelectItem value="4-8">4-8 Questions</SelectItem>
                <SelectItem value="8-12">8-12 Questions</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select value={bloomLevel} onValueChange={setBloomLevel}>
            <SelectTrigger className="mb-4">
              <SelectValue placeholder="Select a level" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Bloom's Taxonomy Level</SelectLabel>
                <SelectItem value="Remember">Remember</SelectItem>
                <SelectItem value="Understand">Understand</SelectItem>
                <SelectItem value="Apply">Apply</SelectItem>
                <SelectItem value="Analyze">Analyze</SelectItem>
                <SelectItem value="Evaluate">Evaluate</SelectItem>
                <SelectItem value="Create">Create</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Enter question prompt..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mb-4"
          />
          <Button
            className="w-full"
            onClick={handleGenerate}
            disabled={loading || input.trim() === "" || bloomLevel === ""}
          >
            {loading ? "Generating..." : "Generate"}
          </Button>

            {output && Array.isArray(output) && (
            <div className="mt-4 p-4 bg-secondary text-primary rounded-md shadow-md">
              <h3 className="text-lg font-semibold">Generated Questions:</h3>
              <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedQuestions.size === output.length}
                onCheckedChange={handleSelectAll}
              />
              <span>Select All</span>
              </div>
              {output.map((question: any, index: number) => (
              <div key={index} className="mb-4 flex items-start gap-2">
                <Checkbox
                checked={selectedQuestions.has(index)}
                onCheckedChange={() => handleCheckboxChange(index)}
                />
                <div>
                <strong>Question:</strong> {question.question}
                {question.type === "MCQ" && (
                  <ul>
                  {question.options.map((opt: string, i: number) => (
                    <li key={i}>{String.fromCharCode(65 + i)}. {opt}</li>
                  ))}
                  <p><strong>Correct Answer:</strong> {question.correct_answer}</p>
                  </ul>
                )}
                {question.type === "Direct" && (
                  <p><strong>Answer:</strong> {question.answer}</p>
                )}
                <p><strong>Hints:</strong></p>
                <ul>
                  {question.hints.map((hint: string, i: number) => (
                  <li key={i}>{hint}</li>
                  ))}
                </ul>
                </div>
              </div>
              ))}
              <Button
              className="w-full mt-4"
              onClick={handleSave}
              disabled={selectedQuestions.size === 0}
              >
              Save Selected Questions
              </Button>
            </div>
            )}
          <Button variant="outline" className="mt-4 w-full" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}