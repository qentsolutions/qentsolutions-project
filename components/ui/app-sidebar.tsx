"use client";
import { useState } from "react";
import { Calendar, ChevronDown, ChevronRight, Home, Inbox, Search, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
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
    url: "#",
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
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  Select Workspace
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
    </Sidebar>
  );
}

// Composant pour gérer chaque item avec collapsible
function CollapsibleMenuItem({ item }: { item: MenuItem }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapsible = () => setIsOpen(!isOpen);

  return (
    <Collapsible defaultOpen={false} open={isOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton onClick={toggleCollapsible} className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <item.icon />
              <span className="ml-2">{item.title}</span>
            </div>
            {item.subItems ? (
              isOpen ? <ChevronDown className="ml-auto" /> : <ChevronRight className="ml-auto" />
            ) : null}
          </SidebarMenuButton>
        </CollapsibleTrigger>

        {/* Sous-menus pliables */}
        {item.subItems && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.subItems.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild>
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
