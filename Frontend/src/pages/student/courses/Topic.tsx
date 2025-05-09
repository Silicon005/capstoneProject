import React from 'react';
import TestCard from './TestCard';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


interface Topic {
  title: string;
}

interface TopicProps {
  topic: Topic;
  topicKey:Number;
}

const Topic: React.FC<TopicProps> = ({ topicKey, topic }) => {

  const Test =[
    {
        id:1,
        Questions:30,
        Time: "30m",
        type:"Easy",
        topic:"Basic Concepts",
        title:"Data Structures and Algorithms",
    },
    {   id:2,
        Questions:20,
        Time: "1h",
        type:"Medium",
        topic:"Basic Concepts",
        title:"Data Structures and Algorithms",
    },
    {   id:3,
        Questions:15,
        Time: "2h",
        type:"Hard",
        topic:"Basic Concepts",
        title:"Data Structures and Algorithms",
    }
]

  return <> 
      <AccordionItem value={`item-${topicKey}`}>
        <AccordionTrigger className=''>{topic.title}</AccordionTrigger>
        <AccordionContent>

            <div className='w-full'>
                <TestCard Test={Test[0]} />
            </div>
          
        </AccordionContent>
      </AccordionItem>
  </>
};

export default Topic;
