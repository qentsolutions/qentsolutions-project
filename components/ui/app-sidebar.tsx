"use client";
import { useState } from "react";
import { Calendar, ChevronDown, ChevronRight, ChevronUp, Home, Inbox, Power, Search, Settings, User2 } from "lucide-react";
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
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { LogoutButton } from "../auth/logout-button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { FaUser } from "react-icons/fa";
import { Separator } from "./separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Définition des types
interface SubItem {
  title: string;
  url: string;
}

interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType; // Utilisation de React.ElementType pour l'icône
  subItems?: SubItem[]; // Optionnel, car certains items n'ont pas de sous-menus
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


  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Image src="/vercel.svg" alt="vercel" width={30} height={30} className="bg-white ml-2" />
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Acme Corp.</span>
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
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
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
    </Sidebar >
  );
}

// Composant pour gérer chaque item avec collapsible
function CollapsibleMenuItem({ item }: { item: MenuItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Obtient le chemin d'URL actuel

  const isActive = pathname === item.url; // Vérifie si l'élément est actif

  const toggleCollapsible = () => setIsOpen(!isOpen);

  return (
    <Collapsible defaultOpen={false} open={isOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          {/* Vérifier si l'élément a un sous-menu ou non */}
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
            // Si l'élément n'a pas de sous-menu, utiliser un lien pour rediriger
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

        {/* Sous-menus pliables */}
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

