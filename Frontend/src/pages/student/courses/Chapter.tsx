import React from 'react';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
    Accordion,
  } from "@/components/ui/accordion"

import { 
    BookOpen,
    ChevronRight, 
} from 'lucide-react';

// Insert Components
import Topic from './Topic';


interface ChapterProps {
  chapter: {
    title: string;
    topic: Topic[];
  };
}

const Chapter: React.FC<ChapterProps> = ({ chapter }) => {
  return (
    <div className='my-2'>
        <Collapsible >
            <CollapsibleTrigger className="w-full block group/collapsible">
                <div className="w-full px-4 py-3  bg-sidebar-accent hover:bg-sidebar rounded-lg shadow-sm flex border text- items-center gap-3" >
                    <BookOpen fill="black" className="w-[20px]"/>
                    <p>{chapter.title}</p>
                    <ChevronRight className="w-[20px] ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </div>
            </CollapsibleTrigger>

            <CollapsibleContent>                    
                <div className='px-4'>
                    <Accordion type="single" collapsible>
                        {
                            chapter.topic?.map((topic, index)=>(
                                <Topic key={index} topicKey={index} topic={topic}/>
                            ))
                        }
                    </Accordion>
                    
                </div>
            </CollapsibleContent>
        </Collapsible>
    </div>
  )
}

export default Chapter;