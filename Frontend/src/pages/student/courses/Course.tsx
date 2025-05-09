import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import {
  Clock4,
  TvMinimal
} from 'lucide-react';


// My Imports 
import Spinner from '@/Spinner/Spinner';
import Chapter from './Chapter';
import ProgressCircular from '../common/ProgressCircular';
import authorImage from '../assets/Gahinath_Madake.jpg';






interface Topic {
  title: string;
}

interface Chapter {
  title: string;
  topic: Topic[];
}

interface Course {
  title: string;
  about: string;
  branch: string;
  duration: string;
  author: string;
  progress: number;
  authorImage: string;
  chapters: Record<string, Chapter>;
}

const c1 = {
  title:"Data Structures and algorithms",
  about: "Master core data structures and algorithms for efficient problem-solving in coding interviews.",
  branch: "CS",
  duration: "6 months",
  author: "Gahinath Madake",
  progress:80,
  authorImage: authorImage,
  chapters:{
      chapter1: {
          title: "Arrays",
          topic: [
              { title: "Basic Concepts" },
              { title: "Linear Search" },
              { title: "Binary Search" },
              { title: "Two Pointer Technique" },
              { title: "Kadane's Algorithm" }
          ]
      },
      chapter2: {
          title: "Linked Lists",
          topic: [
              { title: "Singly Linked List" },
              { title: "Doubly Linked List" },
              { title: "Circular Linked List" },
              { title: "Reverse a Linked List" },
              { title: "Detect Loop in Linked List" },
              { title: "Merge Two Sorted Linked Lists" }
          ]
      },
      chapter3: {
          title: "Stacks & Queues",
          topic: [
              { title: "Stack Operations" },
              { title: "Queue Operations" },
              { title: "Deque & Priority Queue" },
              { title: "Next Greater Element" },
              { title: "Balanced Parentheses" }
          ]
      },
      chapter4: {
          title: "Recursion & Backtracking",
          topic: [
              { title: "Recursion Basics" },
              { title: "Subset Generation" },
              { title: "N-Queens Problem" },
              { title: "Sudoku Solver" },
              { title: "Rat in a Maze" }
          ]
      },
      chapter5: {
          title: "Sorting & Searching",
          topic: [
              { title: "Bubble Sort" },
              { title: "Merge Sort" },
              { title: "Quick Sort" },
              { title: "Heap Sort" },
              { title: "Binary Search Variations" },
              { title: "Ternary Search" }
          ]
      },
      chapter6: {
          title: "Graphs",
          topic: [
              { title: "Graph Representation" },
              { title: "BFS & DFS" },
              { title: "Dijkstra’s Algorithm" },
              { title: "Floyd Warshall Algorithm" },
              { title: "Kruskal’s Algorithm" }
          ]
      }
  }
};

const Course = () => {
  // const { courseid } = useParams();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    setLoading(true);

    setCourse(c1);

    setLoading(false);
  }, [])

  
    return (
      <div className="px-20 py-4">
        {
          loading
          ?
          <div className='w-full h-screen flex justify-center items-center'>
            <Spinner />
          </div>
          :
          (
            !course 
            ?
            <div className='w-full h-screen flex justify-center items-center'>
              Course is unavailable...
            </div>
            :
            <div className="w-full">
      
              <Card className="bg-sidebar">
                <CardHeader>
                  <div className="flex flex-wrap gap-6">
                    <ProgressCircular progress={0} size={60}/>
      
                    <div>
                      <h1 className="text-xl placeholder-opacity-85 font-semibold">{course.title}</h1>
                      <p className="italic text-sm">by {course.author}</p>
      
                      <p className="my-4 text-md font-semibold">"{course.about}"</p>
      
                      <div className="opacity-70 flex gap-8">
                        <div className="flex gap-2">
                          <Clock4 className="w-[20px]"/>
                          <p><label className="font-semibold">Duration:</label> {course.duration}</p>
                        </div>
                        <div className="flex gap-2">
                          <TvMinimal className="w-[20px]"/>
                          <p><label className="font-semibold">Branch:</label> {course.branch}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>  
              </Card>
      
              <Card className="bg-sidebar mt-6">
                <CardContent>
                  <div className="my-3">
                    <h3 className="text-lg font-semibold">Chapters:</h3>
                    {Object.keys(course.chapters).map((key) => (
                      <Chapter
                        key={key}
                        chapter={course.chapters[key as keyof typeof course.chapters]}
                      />
                    ))}
                  </div>
                </CardContent>  
              </Card>
      
            </div>
          )
        }
  
      </div>
    );
}


export default Course;
    



