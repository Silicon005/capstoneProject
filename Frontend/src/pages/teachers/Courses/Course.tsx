import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar"; 
import { Play, Settings, Pencil, Plus, Check } from "lucide-react";
import Chapter from "./Chapter";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

const Course = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [fetchedCourse, setFetchedCourse] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [loading, setLoading] = useState(true); // Step 1: Add loading state

  const fetchCourseDetails = async () => {
    setLoading(true); // Step 2: Set loading to true before fetching
    try {
      const response = await axios.get(`http://localhost:3000/api/teacher/course/${courseId}`);
      if (response.data.success) {
        setFetchedCourse(response.data.course);
        setChapters(response.data.course.chapters);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false); // Step 2: Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const toggleEdit = () => {
    if (isEditing && needsRefresh) {
      fetchCourseDetails();
      setNeedsRefresh(false);
    }
    setIsEditing(!isEditing);
  };

  const addChapter = async () => {
    if (!newChapterTitle.trim()) return;
    
    try {
      const response = await axios.post("http://localhost:3000/api/teacher/createchapter", {
        name: newChapterTitle,
        courseId: courseId,
      });

      if (response.data.success) {
        setChapters(prev => [...prev, response.data.chapter]);
        setNeedsRefresh(true);
      }
    } catch (error) {
      console.error("Error adding chapter:", error);
    }
    
    setNewChapterTitle("");
    setIsChapterDialogOpen(false);
  };

  const deleteChapter = async (chapterId: string) => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/teacher/chapter/${chapterId}`);
      
      if (data.hasTopics && data.hasTests) {
        const confirmDelete = window.confirm(
          "This chapter contains both topics and tests. Are you sure you want to delete it?"
        );
        if (!confirmDelete) return;
      } else if (data.hasTopics) {
        const confirmDelete = window.confirm(
          "This chapter contains topics. Are you sure you want to delete it?"
        );
        if (!confirmDelete) return;
      } else if (data.hasTests) {
        const confirmDelete = window.confirm(
          "This chapter contains tests. Are you sure you want to delete it?"
        );
        if (!confirmDelete) return;
      }
  
      await axios.delete(`http://localhost:3000/api/teacher/chapter/${chapterId}`);
  
      setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
      setNeedsRefresh(true);
  
      alert("Chapter deleted successfully!"); // UI feedback
    } catch (error) {
      console.error("Error deleting chapter:", error);
      alert("Failed to delete chapter.");
    }
  };
  
  const deleteTopic = async (chapterId: string, topicId: string) => {
    try {
      console.log("Attempting to delete topic:", topicId);
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this topic?"
      );
      if (!confirmDelete) {
        console.log("Topic deletion cancelled by user.");
        return;
      }
  
      const response = await axios.delete(`http://localhost:3000/api/teacher/topic/${topicId}`);
      
      console.log("Delete response:", response.data);
  
      setChapters((prev) =>
        prev.map((ch) =>
          ch.id === chapterId
            ? { ...ch, topics: ch.topics?.filter((t: { id: string; }) => t.id !== topicId) || [] }
            : ch
        )
      );
  
      setNeedsRefresh(true);
      alert("Topic deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting topic:", error?.response?.data || error.message);
      alert("Failed to delete topic.");
    }
  };

  const addTopic = async (chapterId: string, newTopicTitle: string) => {
    if (!newTopicTitle.trim()) return;

    try {
      const response = await axios.post("http://localhost:3000/api/teacher/createtopic", {
        name: newTopicTitle,
        chapterId,
      });

      if (response.data.success) {
        setChapters(prev => prev.map(ch => 
          ch.id === chapterId 
            ? { ...ch, topics: [...(ch.topics || []), response.data.topic] }
            : ch
        ));
        setNeedsRefresh(true);
      }
    } catch (error) {
      console.error("Error creating topic:", error);
    }
  };

  const editChapter = async (chapterId: string, newName: string) => {
    try {
      await axios.put(`http://localhost:3000/api/teacher/chapter/${chapterId}`, { name: newName });
      setChapters(prev => prev.map(ch => 
        ch.id === chapterId ? { ...ch, name: newName } : ch
      ));
      setNeedsRefresh(true);
    } catch (error) {
      console.error("Error updating chapter:", error);
    }
  };

  const editTopic = async (topicId: string, newName: string) => {
    try {
      await axios.put(`http://localhost:3000/api/teacher/topic/${topicId}`, { name: newName });
      setChapters(prev => prev.map(ch => ({
        ...ch,
        topics: ch.topics?.map((t: { id: string; }) => t.id === topicId ? { ...t, name: newName } : t) || []
      })));
      setNeedsRefresh(true);
    } catch (error) {
      console.error("Error updating topic:", error);
    }
  };

  // Loading state: Display a spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 dark:border-neutral-100 border-stone-950"></div>
      </div>
    );
  }

  if (!fetchedCourse) return null;

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (fetchedCourse.progress / 100) * circumference;

  return (
    <SidebarInset>
      <div className="px-20 py-4 min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <div className="w-full">
          <Card className="bg-gray-100 dark:bg-sidebar relative">
            <CardHeader>
              <div className="absolute top-5 right-5">
                <button className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition" 
                  onClick={() => navigate(`/teacher/course-settings/${courseId}`)}>
                  <Settings className="w-6 h-6 cursor-pointer text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="relative w-[60px] h-[60px]">
                  <svg className="absolute top-0 left-0" width="60" height="60">
                    <circle cx="30" cy="30" r={radius} stroke="gray" strokeWidth="4" fill="transparent" />
                    <circle
                      cx="30"
                      cy="30"
                      r={radius}
                      stroke="blue"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-1 bg-gray-200 dark:bg-sidebar rounded-full flex items-center justify-center">
                    {fetchedCourse.progress === 0 ? 
                      <Play fill="black" /> : 
                      <span className="font-semibold">{fetchedCourse.progress}%</span>}
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-semibold">{fetchedCourse.name}</h1>
                  <p className="italic text-sm">by Unknown Teacher</p>
                  <p className="my-4 text-md font-semibold">{fetchedCourse.description}</p>
                  <p><label className="font-semibold">School:</label> {fetchedCourse.school?.name || 'N/A'}</p>
                  <p><label className="font-semibold">Semester:</label> {fetchedCourse.semester?.name || 'N/A'}</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-gray-100 dark:bg-sidebar mt-6 relative">
            <div className="flex items-center justify-between px-6 py-3">
              <h3 className="text-lg font-semibold">Chapters</h3>
              <div className="flex gap-3">
                {isEditing && (
                  <Dialog open={isChapterDialogOpen} onOpenChange={setIsChapterDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-5 h-5 mr-2" /> Add Chapter
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Chapter</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 p-4">
                        <Input
                          placeholder="Enter chapter name..."
                          value={newChapterTitle}
                          onChange={(e) => setNewChapterTitle(e.target.value)}
                        />
                        <Button className="w-full" onClick={addChapter}>
                          <Check className="w-5 h-5 mr-2" /> Add Chapter
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                <Button onClick={toggleEdit}>
                  {isEditing ? <Check className="w-5 h-5 mr-2" /> : <Pencil className="w-5 h-5 mr-2" />}
                  {isEditing ? "Done" : "Edit"}
                </Button>
              </div>
            </div>

            <CardContent>
              <div className="my-3">
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="relative group">
                    <Chapter 
                      chapter={chapter}
                      isEditing={isEditing}
                      onDelete={() => deleteChapter(chapter.id)}
                      onAddTopic={(title) => addTopic(chapter.id, title)}
                      onDeleteTopic={(topicId) => deleteTopic(chapter.id, topicId)}
                      onEditChapter={editChapter}
                      onEditTopic={editTopic}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
};

export default Course;