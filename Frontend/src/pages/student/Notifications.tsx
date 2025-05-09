
import { GalleryVerticalEnd } from "lucide-react";
import { Clock4 } from 'lucide-react';
import { Separator } from "@/components/ui/separator"


const notifications = () => {

    const notify = [
        {
            heading:"Successfully Enrrolled in DBMS course",
            description:"Start your preparation with the Course. Learn implement and grow into the pairs",
            date: " 29 Feb, 2024",
            time: "4:35 am",
            isRead: false,
        },

        {
            heading:"Successfully Enrrolled in DBMS course",
            description:"Start your preparation with the Course. Learn implement and grow into the pairs",
            date: " 29 Feb, 2024",
            time: "4:35 am",
        },

        {
            heading:"Successfully Enrrolled in DBMS course",
            description:"Start your preparation with the Course. Learn implement and grow into the pairs",
            date: " 29 Feb, 2024",
            time: "4:35 am",
        },

    ]
  return (
    <div className="px-20 py-4">
        <h1 className="text-lg font-semibold">Notifications</h1>
        
        <div className="mt-3 w-10/12 bg-sidebar rounded-sm">
            
            {notify.map((notification, index) => (    
                <>
                    <div key={index} className="p-3 flex wrap gap-3">
                        
                        <div className="flex mt-3 h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <GalleryVerticalEnd className="size-4" />
                        </div>

                        
                        <div className="min-w-[400px]">
                            <h2 className="text-md font-semibold opacity-80">{notification.heading}</h2>
                            <p className="mt-1 opacity-80 text-sm">{notification.description}</p>

                            <p className="mt-3 text-sm opacity-60 flex gap-2">
                                <Clock4 className="w-4" />
                                <span className="italic">{notification.date} at {notification.time}</span>
                            </p>
                        </div>
                    </div>

                    {/* Divider Line */}
                    {index !== notify.length - 1 && <Separator/>}
                </>
            ))}

               


        </div>
    </div>
  )
}

export default notifications;