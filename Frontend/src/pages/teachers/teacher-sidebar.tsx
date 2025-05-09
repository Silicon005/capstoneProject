import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import { Frame, GalleryVerticalEnd, Plus } from "lucide-react";
import {  Eye } from "lucide-react";

import {
  Breadcrumb, 
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";  
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useUser } from "../../hooks/userContext"; 
import { Navigate, useLocation } from "react-router-dom";

export default function TeacherSidebar() {
  const { userId } = useUser();
  const location = useLocation();

  const isAtIndex = location.pathname === "/teacher";

  if (userId && isAtIndex) {
    return <Navigate to={`/teacher/teacherdashboard/${userId}`} replace />;
  }

  const [courses, setCourses] = useState<
    { id: string; name: string; title: string; url?: string; icon?: any }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unseenCount, setUnseenCount] = useState(0);

  const fetchUnseenCount = async () => {
    if (!userId) return; 

    try {
      const response = await axios.get(`http://localhost:3000/api/notifications/unseen/${userId}`); // Your API for unseen count
      if (response.status !== 200) throw new Error("Failed to fetch unseen notifications count");

      setUnseenCount(response.data.count || 0); // Assuming your API returns { count: number }
    } catch (err) {
      console.error("Error fetching unseen count:", err);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      if (!userId) return; 
      console.log("Fetching courses for teacher:", userId);

      try {
        const response = await axios.get(
          `http://localhost:3000/api/teacher/courses?teacherId=${userId}`
        );
        if (response.status !== 200) throw new Error("Failed to fetch courses");

        const data = response.data;
        console.log("Fetched Courses:", data);

        setCourses(
          data.courses.map((course: any) => ({
            id: course.id,
            name: course.name,
            title: course.description || "No description",
            url: `/teacher/courses/${course.id}`,
          }))
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
    fetchUnseenCount();
  }, [userId]); 

  console.log("Unseen Count:", unseenCount);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!userId) return; 
      console.log("Fetching courses for teacher:", userId);

      try {
        const response = await axios.get(
          `http://localhost:3000/api/teacher/courses?teacherId=${userId}`
        );
        if (response.status !== 200) throw new Error("Failed to fetch courses");

        const data = response.data;
        console.log("Fetched Courses:", data);

        setCourses(
          data.courses.map((course: any) => ({
            id: course.id,
            name: course.name,
            title: course.description || "No description",
            url: `/teacher/courses/${course.id}`,
          }))
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId]); 

  const staticCourses = [
    // { id: "dsa", name: "Data Structures and Algorithms", title: "Master DSA for coding interviews" },
    // { id: "ml", name: "Machine Learning", title: "Learn ML concepts and algorithms" },
    // { id: "webdev", name: "Web Development", title: "Full-stack web development course" },
    { id: "create-course", name: "Create a Course", title: "Start a new course", icon: Plus, url: userId ? `/teacher/create-course/${userId}` : "#" },
    { id: "view-all", name: "View All", title: "See all available courses", icon: Eye, url: "/courses" }
  ];

  const allCourses = [...staticCourses, ...courses];

  const data = {
    user: {
      name: "Siddhant Mishra",
      email: "sd@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    Platform: {
      name: "AI Tutor",
      logo: GalleryVerticalEnd,
      plan: "MITAOE",
    },
    navMenu: [
      { name: "Dashboard", url: `/teacher/teacherdashboard/${userId}`, icon: Frame },
      { 
        name: `Notifications - ${unseenCount}`,
        url: `/teacher/notifications?teacherId=${userId}`, 
        icon: Frame,  
      },
      // { name: "Site Home", url: "/teacher/sitehome", icon: PieChart }, // Added space between "Site" and "Home"
      {
        title: "Courses",
        url: "#",
        icon: Frame,
        isActive: true,
        items: allCourses.map((course) => ({
          title: course.name,
          url: course.url || `/teacher/courses/${course.id}`,
          icon: course.icon || Frame,
        })),
      },
    ],
  };

  return (
    <SidebarProvider>
      <AppSidebar data={data} />
      <SidebarInset>
        <header className="flex py-2 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4 mx-2" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Teacher Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Separator orientation="vertical" className="h-4 mx-2" />
            <div className="relative left-1/2 transform -translate-x-1/2">
            </div>
        </header>
        <hr />
        
        {loading && (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 dark:border-neutral-100 border-stone-950"></div>
          </div>
        )}

        {error && <p className="text-center text-red-500 p-4">{error}</p>}

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}