import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import { 
    LayoutDashboard,
    House,
    Captions,
    CircleUserRound,
    Bell,
    GalleryVerticalEnd,
} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function TeacherSidebar() {

  const data = {
    user: {
      name: "Gahinath Madake",
      email: "gahinathmadake@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    Platform: {
      name: "AI Tutor",
      logo: GalleryVerticalEnd,
      plan: "MITAOE",
    },
    navMenu: [
        {
            name: "Dashboard",
            url: "/student",
            icon: LayoutDashboard, 
        },
        { 
            name: "SiteHome", 
            url: "/student/sitehome", 
            icon: House,
        },
        {
            title: "Courses",
            url: "#",
            icon: Captions,
            isActive: false,
            items:[
                {
                    title:"Ongoing",
                    url:'/student/courses/ongoing'
                },
                {
                    title:"Completed",
                    url:'/student/courses/completed'
                },
                {
                    title:"All",
                    url:'/student/courses/All'
                },
            ],
            
        },
        {
            name: "Notifications",
            url: "/student/notifications",
            icon: Bell, 
        },
        {
            name: "Help",
            url: "/student/help",
            icon: CircleUserRound, 
        },
    ],
  };

  return (
    <SidebarProvider> {/* ✅ Move SidebarProvider here */}
      <AppSidebar data={data} />
      <SidebarInset>
        {/* Breadcrumb Navigation */}
        <header className="flex py-2 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" /> {/* ✅ This will now control AppSidebar */}
          <Separator orientation="vertical" className="h-4 mx-2" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Student Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <hr />

        {/* ✅ Ensure that the Course component renders inside this shared SidebarProvider */}
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
