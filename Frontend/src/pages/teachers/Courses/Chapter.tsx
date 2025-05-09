import React, { useState , useEffect } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion } from "@/components/ui/accordion";
import { BookOpen, ChevronRight, Trash2, Plus, Pencil, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Topic from './Topic';

interface ChapterProps {
  chapter: {
    id: string;
    name: string;
    topics: Array<{ id: string; name: string }>;
  };
  isEditing: boolean;
  onDelete: () => void;
  onAddTopic: (newTopicTitle: string) => void;
  onDeleteTopic: (topicId: string) => void;
  onEditChapter: (chapterId: string, newName: string) => void;
  onEditTopic: (topicId: string, newName: string) => void;
}

const Chapter: React.FC<ChapterProps> = ({ 
  chapter, 
  isEditing, 
  onDelete, 
  onAddTopic, 
  onDeleteTopic,
  onEditChapter,
  onEditTopic 
}) => {
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(chapter.name);
  const [openTopicId, setOpenTopicId] = useState<string | null>(null);

  const handleAddTopic = () => {
    if (newTopicTitle.trim()) {
      onAddTopic(newTopicTitle);
      setNewTopicTitle("");
    }
  };

  const handleSaveChapter = async () => {
    try {
      await onEditChapter(chapter.id, editedName);
    } catch (error) {
      console.error("Failed to save chapter name:", error);
      setEditedName(chapter.name); // Revert if API fails
    }
    setIsEditingName(false);
  };

  useEffect(() => {
    setEditedName(chapter.name);
  }, [chapter.name]);

  const handleCancelEdit = () => {
    setEditedName(chapter.name);
    setIsEditingName(false);
  };

  return (
    <div className='my-2'>
      <Collapsible>
        <CollapsibleTrigger className="w-full block group/collapsible">
          <div className="w-full px-4 py-3 bg-sidebar-accent hover:bg-sidebar rounded-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3 flex-grow">
              <BookOpen fill="black" className="w-[20px]" />
              {isEditingName ? (
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="h-8 px-2"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <p>{chapter.name}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isEditing && (
                <>
                  {isEditingName ? (
                    <>
                      <button
                        className="p-1 rounded-md text-green-600 hover:bg-green-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveChapter();
                        }}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        className="p-1 rounded-md text-red-600 hover:bg-red-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelEdit();
                        }}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="p-1 rounded-md text-gray-600 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditingName(true);
                        }}
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        className="p-1 rounded-md text-red-600 hover:bg-red-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete();
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </>
              )}
              <ChevronRight className="w-[20px] transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>                    
          <div className='px-4'>
            <Accordion 
              type="single" 
              collapsible
              value={openTopicId || ""}
              onValueChange={setOpenTopicId}
            >
              {chapter.topics?.map((topic) => (
                <Topic
                  key={topic.id}
                  topic={topic}
                  isEditing={isEditing}
                  onDelete={() => onDeleteTopic(topic.id)}
                  onEdit={(newName) => onEditTopic(topic.id, newName)}
                />
              ))}
            </Accordion>
          </div>
          {isEditing && (
            <div className='flex gap-2 items-center px-4 py-2'>
              <Input
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                placeholder="New topic title"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
              />
              <Button onClick={handleAddTopic}>
                <Plus className="w-5 h-5 mr-2" /> Add Topic
              </Button>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default Chapter;