import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {  useParams } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/userContext";
import { useEffect, useState } from "react";
import { db } from "../../Database/FirebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

interface Chapter {
  id: string;
  ChapterNo: number;
  Title: string;
  tests: Test[];
}

interface Test {
  id: string;
  TestName: string;
}

interface Course {
  id: string;
  CourseName: string;
  EnrolledStudentId: string[];
  TeacherId: string;
  CourseTitle: string;
  chapters: Chapter[];
}

export default function CourseLayout() {
  const { userId, userType, userName, userEmail } = useUser();
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (courseId) {
        const courseDoc = doc(db, "Courses", courseId);
        const courseSnapshot = await getDoc(courseDoc);
        if (courseSnapshot.exists()) {
          const courseData = courseSnapshot.data();
          const chaptersCollection = collection(db, `Courses/${courseId}/Chapters`);
          const chaptersSnapshot = await getDocs(chaptersCollection);
          const chaptersList: Chapter[] = [];

          for (const chapterDoc of chaptersSnapshot.docs) {
            const chapterData = chapterDoc.data();
            const testsCollection = collection(db, `Courses/${courseId}/Chapters/${chapterDoc.id}/Test`);
            const testsSnapshot = await getDocs(testsCollection);
            const testsList: Test[] = testsSnapshot.docs.map(testDoc => ({
              id: testDoc.id,
              TestName: testDoc.data().TestName,
            }));

            chaptersList.push({
              id: chapterDoc.id,
              ChapterNo: chapterData.ChapterNo,
              Title: chapterData.Title,
              tests: testsList,
            });
          }

          setCourse({
            id: courseId,
            CourseName: courseData.CourseName,
            EnrolledStudentId: courseData.EnrolledStudentId || [],
            TeacherId: courseData.TeacherId,
            CourseTitle: courseData.Title,
            chapters: chaptersList,
          });
        }
      }
    };
    fetchCourseDetail();
  }, [courseId]);

  if (!course) {
    return <div>Loading Course Details...</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar userId={userId ?? undefined} userType={userType ?? undefined} userName={userName ?? undefined} userEmail={userEmail ?? undefined} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
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
          </div>
        </header>
        <hr />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-8">
          <h1 className="text-2xl font-bold">{course.CourseTitle}</h1>
          <p className="text-gray-600">Course Name: {course.CourseName}</p>
          <p className="text-gray-600">Instructor ID: {course.TeacherId}</p>
          <p className="text-gray-600">Enrolled Students: {course.EnrolledStudentId.length}</p>
          <h2 className="text-xl font-semibold mt-4">Chapters</h2>
          {course.chapters.length > 0 ? (
            <ul className="list-disc list-inside">
              {course.chapters.map(chapter => (
                <li key={chapter.id} className="mt-2">
                  <strong>Chapter {chapter.ChapterNo}:</strong> {chapter.Title}
                  {chapter.tests.length > 0 && (
                    <ul className="ml-6 list-disc list-inside">
                      {chapter.tests.map(test => (
                        <li key={test.id}>{test.TestName}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No chapters available</p>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
