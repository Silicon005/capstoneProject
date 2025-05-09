import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

const questions = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
    hints: ["It's also known as the city of love.", "It has the Eiffel Tower."],
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
    hints: ["Tallest volcano.", "Iron oxide on surface."],
  },
];

export default function QuestionBank() {
  const navigate = useNavigate();
  const [selectedQuestions, setSelectedQuestions] = useState<Record<number, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);

  // Handle individual question selection
  const toggleSelection = (id: number) => {
    setSelectedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle "Select All"
  const toggleSelectAll = () => {
    const newSelectionState = !selectAll;
    setSelectAll(newSelectionState);
    setSelectedQuestions(
      newSelectionState ? Object.fromEntries(questions.map((q) => [q.id, true])) : {}
    );
  };

  return (
    <div className="p-10 min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <Card className="max-w-5xl mx-auto">
        <CardContent className="p-6">
          {/* Header with Select All & Add Question */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Choose from Question Bank</h2>
            <div className="flex items-center space-x-4">
              {/* Add Question Button */}
              <Button variant="default" onClick={() => navigate("/teacher-dashboard/add-question")}>
                Add Question
              </Button>

              {/* Select All Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox checked={selectAll} onCheckedChange={toggleSelectAll} />
                <span className="text-sm">Select All</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Options</TableHead>
                <TableHead>Correct Answer</TableHead>
                <TableHead>Hints</TableHead>
                <TableHead className="text-right">Select</TableHead> {/* Select on Right */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>{question.text}</TableCell>
                  <TableCell>
                    <ul className="list-disc pl-4">
                      {question.options.map((option, index) => (
                        <li key={index}>{option}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>{question.answer}</TableCell>
                  <TableCell>
                    <ul className="list-disc pl-4 text-gray-500">
                      {question.hints.map((hint, index) => (
                        <li key={index}>{hint}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-right">
                  <Checkbox
                    checked={!!selectedQuestions[question.id]}
                    onCheckedChange={() => toggleSelection(question.id)}
                    className="h-4 w-4"
                  />


                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Back Button */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Go Back
            </Button>
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
