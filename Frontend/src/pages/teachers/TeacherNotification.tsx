import { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import { GalleryVerticalEnd, Clock4 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useUser } from "../../hooks/userContext";


import axios from "axios";

const TeacherNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null); // State for error handling
    const [searchParams] = useSearchParams();
    const teacherId = searchParams.get('teacherId'); 
    const { setUnseenCount } = useUser();
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!teacherId) return; // Guard clause

            try {
                const response = await fetch(`http://localhost:3000/api/notifications/${teacherId}`);
                if (!response.ok) throw new Error("Failed to fetch notifications");
                
                const data = await response.json();
                setNotifications(data.notifications || []); // Fallback to an empty array
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setError(error.message); // Set error state
            }
        };

        const markNotificationsAsSeen = async () => {
            if (!teacherId) return;

            try {
                await axios.post(`http://localhost:3000/api/notifications/mark-seen/${teacherId}`);
                setUnseenCount(0);
            } catch (error) {
                console.error("Error marking notifications as seen:", error);
            }
        };

        fetchNotifications();
        markNotificationsAsSeen();
    }, [teacherId]);

    return (
        <div className="px-20 py-4">
            <h1 className="text-lg font-semibold">Notifications</h1>

            <div className="mt-3 w-10/12 bg-sidebar rounded-sm">
                {error ? (
                    <p className="p-3 text-sm text-red-600">{error}</p> // Show error message
                ) : notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <div key={notification.id}>
                            <div className="p-3 flex wrap gap-3">
                                <div className="flex mt-3 h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="min-w-[400px]">
                                    <h2 className="text-md font-semibold opacity-80">{notification.message}</h2>
                                    <p className="mt-3 text-sm opacity-60 flex gap-2">
                                        <Clock4 className="w-4" />
                                        <span className="italic">{new Date(notification.createdAt).toLocaleString()}</span>
                                    </p>
                                </div>
                            </div>
                            {index !== notifications.length - 1 && <Separator />}
                        </div>
                    ))
                ) : (
                    <p className="p-3 text-sm opacity-60">No notifications available.</p>
                )}
            </div>
        </div>
    );
};

export default TeacherNotifications;