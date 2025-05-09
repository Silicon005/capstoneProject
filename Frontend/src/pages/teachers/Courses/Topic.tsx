import React, { useState , useEffect} from 'react';
import TestCard from './TestCard';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface TopicProps {
  topic: {
    id: string;
    name: string;
  };
  isEditing: boolean;
  onDelete: () => void;
  onEdit: (newName: string) => void;
}

const Topic: React.FC<TopicProps> = ({ topic, isEditing, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(topic.name);

  const handleCreateTest = () => {
    navigate(`/teacher/create-test?topicId=${topic.id}`);
  };

  const handleSave = async () => {
    try {
      await onEdit(editedName); // Only pass newName
    } catch (error) {
      console.error("Failed to save topic name:", error);
      setEditedName(topic.name);
    }
    setIsEditingName(false);
  };

  useEffect(() => {
    setEditedName(topic.name);
  }, [topic.name]);

  const handleCancel = () => {
    setEditedName(topic.name);
    setIsEditingName(false);
  };

  return (
    <AccordionItem value={topic.id}>
      <AccordionTrigger className="flex items-center justify-between">
        <div className="flex-1 flex items-center gap-2">
          {isEditingName ? (
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="h-8 px-2"
            />
          ) : (
            <span>{topic.name}</span>
          )}
        </div>
        {isEditing && (
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <>
                <button
                  className="p-1 text-green-600 hover:bg-green-100 rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave();
                  }}
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  className="p-1 text-red-600 hover:bg-red-100 rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancel();
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  className="p-1 text-gray-600 hover:bg-gray-100 rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingName(true);
                  }}
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  className="p-1 text-red-600 hover:bg-red-100 rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        )}
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex justify-end mb-4">
          <Button onClick={handleCreateTest}>Create Test</Button>
        </div>
        <TestCard topicId={topic.id} />
      </AccordionContent>
    </AccordionItem>
  );
};

export default Topic;