import * as React from "react"
import { GalleryVerticalEnd, SquareTerminal, Book } from "lucide-react"
import { AdminNavMain } from "@/components/admin-nav-main"
import { NavUser } from "@/components/nav-user"
import { AdminTeamSwitcher } from "@/components/admin-team-switcher"
import { Link } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    userName?: string;
    userEmail?: string;
}

export function AdminAppSidebar({ userName , userEmail, ...props }: AppSidebarProps) {


    // Sidebar Data Structure
    const sidebarData = {
        user: {
            name: userName || "Default Name",
            email: userEmail || "default@example.com",
            avatar: "/avatars/shadcn.jpg",
        },
        teams: [
            {
                name: "Acme Inc",
                logo: GalleryVerticalEnd,
                plan: "Enterprise",
            },
        ],
        navMain: [
            {
                title: <Link to={`/admin-dashboard`}>Dashboard</Link>,
                url: "/admin-dashboard",
                icon: SquareTerminal,
                isActive: true,
            },
            {
                title: <Link to={`/manage-users`}>Manage Users</Link>,
                url: "/admin/live-users",
                icon: Book,
                isActive: false,
            },
            {
                title: <Link to={`/manage-schools`}>Manage Schools</Link>,
                url: "/admin/live-users",
                icon: Book,
                isActive: false,
            },
        ],
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <AdminTeamSwitcher teams={sidebarData.teams} />
            </SidebarHeader>
            <hr />
            <SidebarContent>
                <AdminNavMain items={sidebarData.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={sidebarData.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
