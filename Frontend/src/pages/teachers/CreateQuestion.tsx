import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

export default function CreateQuestion() {
  const [isQuestionBank, setIsQuestionBank] = useState(true);
  
  return (
    <SidebarInset>
      <div className="px-20 py-4 min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <Card className="bg-gray-100 dark:bg-sidebar mt-6">
          <CardContent>
            <h3 className="text-lg font-semibold">Create Question</h3>
            <div className="mt-4">
              <Button onClick={() => setIsQuestionBank(true)}>Choose from Questions Bank</Button>
              <Button onClick={() => setIsQuestionBank(false)}>Generate Question</Button>
            </div>
            {/* Render either the question bank selection or question generation form */}
            {isQuestionBank ? <QuestionBank /> : <GenerateQuestion />}
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}

function QuestionBank() {
  return (
    <div>
      {/* Implement your questions bank selection UI here */}
      <h4 className="mt-4">Questions Bank</h4>
      <p>Select a question from the bank...</p>
    </div>
  );
}

function GenerateQuestion() {
  return (
    <div>
      {/* Implement your question generation UI here */}
      <h4 className="mt-4">Generate Question</h4>
      <p>Fill out the form to generate a new question...</p>
    </div>
  );
}