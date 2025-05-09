import {Card, CardContent,} from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2, Clock9, Timer } from "lucide-react";

export default function TeacherDashboard() {
  const { teacherId } = useParams<{ teacherId: string }>();

  const [stats, setStats] = useState({ upcoming: 0, ongoing: 0, completed: 0 });
  const [tests, setTests] = useState<{ id: string; name: string }[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get(`http://localhost:3000/api/dashboard/teacher/${teacherId}`);
      const testCounts = res.data?.dashboard?.testCounts;
      if (testCounts) {
        setStats({ upcoming: testCounts.upcoming, ongoing: testCounts.ongoing, completed: testCounts.done });
      }
    };

    const fetchTests = async () => {
      const res = await axios.get(`http://localhost:3000/api/dashboard/teacher/tests/${teacherId}`);
      setTests(res.data.tests || []);
    };

    fetchStats();
    fetchTests();
  }, [teacherId]);

  useEffect(() => {
    if (!selectedTestId) return;
    console.log("Selected Test ID:", selectedTestId);
    const fetchAnalytics = async () => {
      const res = await axios.get(`http://localhost:3000/api/dashboard/teacher/testanalytics/${selectedTestId}`);
      console.log("Analytics response:", res.data);
      setAnalytics(res.data.analytics);
    };
    fetchAnalytics();
  }, [selectedTestId]);

  return (
    <div className="px-4 md:px-8 lg:px-12 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-sidebar text-white shadow-md rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-base">Upcoming Tests</p>
              <h2 className="text-2xl font-bold">{stats.upcoming}</h2>
            </div>
            <Clock9 className="size-8 text-yellow-400" />
          </CardContent>
        </Card>

        <Card className="bg-sidebar text-white shadow-md rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-base">Ongoing Tests</p>
              <h2 className="text-2xl font-bold">{stats.ongoing}</h2>
            </div>
            <Timer className="size-8 text-blue-400" />
          </CardContent>
        </Card>

        <Card className="bg-sidebar text-white shadow-md rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-base">Completed Tests</p>
              <h2 className="text-2xl font-bold">{stats.completed}</h2>
            </div>
            <CheckCircle2 className="size-8 text-green-400" />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 shadow-md rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Analytics</h2>

          <Select onValueChange={setSelectedTestId}>
            <SelectTrigger className="w-full sm:w-72 mb-4">
              <SelectValue placeholder="Select a test" />
            </SelectTrigger>
            <SelectContent>
              {tests.map(test => (
                <SelectItem key={test.id} value={test.id}>
                  {test.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {analytics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-muted p-4 rounded-xl shadow">
                <h4 className="text-sm text-muted-foreground">Test Name</h4>
                <p className="text-lg font-bold">{analytics.testName}</p>
              </Card>

              <Card className="bg-muted p-4 rounded-xl shadow">
                <h4 className="text-sm text-muted-foreground">Total Students Enrolled</h4>
                <p className="text-lg font-bold">{analytics.totalStudents}</p>
              </Card>

              <Card className="bg-muted p-4 rounded-xl shadow">
                <h4 className="text-sm text-muted-foreground">Students Attempted</h4>
                <p className="text-lg font-bold">{analytics.attempts}</p>
              </Card>

              <Card className="bg-muted p-4 rounded-xl shadow">
                <h4 className="text-sm text-muted-foreground">Average Marks</h4>
                <p className="text-lg font-bold">{analytics.avgMarks}</p>
              </Card>

              <Card className="bg-muted p-4 rounded-xl shadow">
                <h4 className="text-sm text-muted-foreground">Correct Answer %</h4>
                <p className="text-lg font-bold">{analytics.correctPercent}%</p>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
