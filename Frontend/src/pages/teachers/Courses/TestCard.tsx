

import { useEffect, useState } from "react";
import easy from "../assets/Easy.jpg";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Test {
  id: string;
  name: string;
  totalMarks: number;
  createdAt: string;
  topicName: string;
  averageLevel: string;
}

const TestCard = ({ topicId }: { topicId: string }) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    if (!topicId) return;

    const fetchTests = async () => {
      setLoading(true); // Begin loading
      try {
        const response = await fetch(`http://localhost:3000/api/test/get-tests?topicId=${topicId}`);
        const data = await response.json();

        if (data.success && Array.isArray(data.tests)) {
          setTests(data.tests);
        } else {
          console.error("Error fetching tests:", data);
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchTests();
  }, [topicId]);

  const handleCardClick = (testId: string) => {
    navigate(`/teacher/test/${testId}`); // Correct path
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 dark:border-neutral-100 border-stone-950"></div>
      </div>
    );
  }


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {tests.map((test) => (
        <Card
          key={test.id}
          className="w-full max-w-[260px] sm:max-w-[220px] md:max-w-[240px] lg:max-w-[260px] xl:max-w-[280px] overflow-hidden transition-all cursor-pointer hover:shadow-lg"
          onClick={() => handleCardClick(test.id)}
        >
          {/* Image Section */}
          <div className="w-full h-[120px] sm:h-[130px] md:h-[140px] relative">
            <img
              src={easy}
              alt="Test"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10 p-2 flex flex-col justify-between text-white">
              <label className="text-xs sm:text-sm font-medium">
                Level: {test.averageLevel}
              </label>
              <h1 className="my-1 text-sm sm:text-base md:text-lg font-semibold">
                {test.name}
              </h1>
              <p className="my-1 text-xs sm:text-sm md:text-base font-semibold">
                Topic: {test.topicName}
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="py-2 px-3 flex justify-between text-center">
            <div className="flex flex-col items-center">
              <span className="text-xs sm:text-sm md:text-base font-semibold">
                {test.totalMarks}
              </span>
              <span className="text-[9px] sm:text-[10px] md:text-xs opacity-80">
                Total Marks
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs sm:text-sm md:text-base font-semibold">
                {new Date(test.createdAt).toLocaleDateString()}
              </span>
              <span className="text-[9px] sm:text-[10px] md:text-xs opacity-80">
                Created On
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TestCard;


