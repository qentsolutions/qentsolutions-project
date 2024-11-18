"use client";
import { useState } from "react";
import { Calendar, ChevronDown, ChevronRight, ChevronUp, Home, Inbox, Plus, Power, Search, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { LogoutButton } from "../auth/logout-button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { FaUser } from "react-icons/fa";
import { Separator } from "./separator";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCurrentWorkspace } from "@/hooks/use-current-workspace";

interface SubItem {
  title: string;
  url: string;
}

interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
  subItems?: SubItem[];
}

const items: MenuItem[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
    subItems: [
      { title: "All Messages", url: "#all-messages" },
      { title: "Unread", url: "#unread" },
    ],
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    subItems: [
      { title: "Profile", url: "#profile" },
      { title: "Account", url: "#account" },
    ],
  },
];

export function AppSidebar() {
  const user = useCurrentUser();
  const router = useRouter();
  const { currentWorkspace, workspaces, setCurrentWorkspace } = useCurrentWorkspace();

  const handleNewWorkspace = () => {
    router.push("/workspace/select");
  };

  const handleWorkspaceSelect = (workspace: any) => {
    setCurrentWorkspace(workspace);
    router.push(`/workspace/${workspace.id}`);
  };


  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {currentWorkspace?.logo ? (
                    // Afficher le logo du workspace
                    <Image
                      src={currentWorkspace.logo}
                      alt={currentWorkspace.name}
                      width={30}
                      height={30}
                      className="object-cover rounded bg-white ml-2"
                    />
                  ) : (
                    // Afficher l'initiale du nom du workspace
                    <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded ml-2">
                      <span className="font-semibold">
                        {currentWorkspace?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="ml-2">{currentWorkspace?.name || "Select a workspace"}</span>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuLabel className="text-xs  font-normal text-gray-600 flex items-center justify-between">
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                {workspaces.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace.id}
                    onClick={() => handleWorkspaceSelect(workspace)}
                  >
                    {workspace.logo ? (
                      <div className="w-6 h-6 bg-gray-100 flex items-center justify-center rounded">
                        <Image
                          src={workspace.logo}
                          alt={workspace.name}
                          width={24}
                          height={24}
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-blue-500 text-white flex items-center justify-center rounded">
                        <span className="font-semibold">
                          {workspace.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span>{workspace.name}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem className="text-xs text-gray-500" onClick={handleNewWorkspace}>
                  <Plus className=" h-4 w-4" />
                  <span>New Workspace</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <CollapsibleMenuItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="bg-gray-700" />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar>
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className="bg-sky-500">
                      <FaUser className="text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-2">{user?.name}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <Link href="/account">
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/billing">
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                </Link>
                <LogoutButton>
                  <DropdownMenuItem className="flex items-center justify-between">
                    <span>Sign out</span>
                    <span><Power className="text-red-500" size={14} /></span>
                  </DropdownMenuItem>
                </LogoutButton>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function CollapsibleMenuItem({ item }: { item: MenuItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === item.url;
  const toggleCollapsible = () => setIsOpen(!isOpen);

  return (
    <Collapsible defaultOpen={false} open={isOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          {item.subItems ? (
            <SidebarMenuButton
              onClick={toggleCollapsible}
              className={cn(
                "flex items-center justify-between w-full hover:bg-[#3B4A58] hover:text-[#3CB1F5]",
                isActive
                  ? "bg-[#3B4A58] text-[#3CB1F5] border-r-4 border-blue-500"
                  : "text-[#C8C8C8]"
              )}
            >
              <div className="flex items-center">
                <item.icon className="ml-2" />
                <span className="ml-4">{item.title}</span>
              </div>
              {isOpen ? <ChevronDown className="ml-auto" /> : <ChevronRight className="ml-auto" />}
            </SidebarMenuButton>
          ) : (
            <Link href={item.url} className="w-full" passHref>
              <SidebarMenuButton
                className={cn(
                  "flex items-center justify-between w-full hover:bg-[#3B4A58] hover:text-[#3CB1F5]",
                  isActive
                    ? "bg-[#3B4A58] text-[#3CB1F5] border-r-4 border-blue-500"
                    : "text-[#C8C8C8]"
                )}
              >
                <div className="flex items-center">
                  <item.icon className="ml-2" />
                  <span className="ml-4">{item.title}</span>
                </div>
              </SidebarMenuButton>
            </Link>
          )}
        </CollapsibleTrigger>

        {item.subItems && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.subItems.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    className={pathname === subItem.url ? "bg-[#3B4A58] text-[#3CB1F5] border-r-4 border-blue-500 " : "text-[#C8C8C8]"}
                    asChild
                  >
                    <a href={subItem.url}>{subItem.title}</a>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
}