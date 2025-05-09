"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Link } from "react-router-dom";
import {SidebarMenuButton} from "@/components/ui/sidebar";
import { useUser } from "../hooks/userContext";

export function NavUser(){
  const { userName, userEmail } = useUser();

  return (
    <Link to="user/profile">
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={"/avatars/shadcn.jpg"} alt={userName || "User"} />
                    <AvatarFallback className="rounded-lg">
                      {userName?.split(" ").map(n => n[0]).join("") || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userName || "John Doe"}</span>
                    <span className="truncate text-xs">{userEmail || 'JohnDoe@gmail.com'}</span>
                  </div>
              </SidebarMenuButton>
    </Link>
  );
}