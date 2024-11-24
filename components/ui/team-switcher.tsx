"use client"

import * as React from "react"
import { Bolt, ChevronsUpDown, Cog, Plus, Settings, } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { useCurrentWorkspace } from "@/hooks/use-current-workspace"
import Image from "next/image"
import Link from "next/link"

export function TeamSwitcher({
    teams,
}: {
    teams: {
        name: string
        logo: React.ElementType
        plan: string
    }[]
}) {
    const { isMobile } = useSidebar()
    const [activeTeam, setActiveTeam] = React.useState(teams[0])
    const router = useRouter();
    const { currentWorkspace, workspaces, setCurrentWorkspace } = useCurrentWorkspace();

    const handleNewWorkspace = () => {
        // Redirige l'utilisateur vers la page pour sélectionner ou créer un nouveau workspace
        router.push("/workspace/select");
    };

    const handleWorkspaceSelect = (workspace: any) => {
        setCurrentWorkspace(workspace);  // Met à jour l'espace de travail actuel
        router.push(`/workspace/${workspace.id}`);  // Redirige vers le workspace sélectionné
    };
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                {currentWorkspace?.logo ? (
                                    // Afficher le logo du workspace
                                    <Image
                                        src={currentWorkspace.logo}
                                        alt={currentWorkspace.name}
                                        width={30}
                                        height={30}
                                        className="object-cover rounded"
                                    />
                                ) : (
                                    // Afficher l'initiale du nom du workspace
                                    <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded">
                                        <span className="font-semibold">
                                            {currentWorkspace?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{currentWorkspace?.name || "Select a workspace"}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Workspaces
                        </DropdownMenuLabel>

                        {workspaces.map((workspace) => (
                            <div className="flex items-center w-full">
                                <DropdownMenuItem
                                    key={workspace.id}
                                    onClick={() => handleWorkspaceSelect(workspace)}
                                    className={`${currentWorkspace?.id === workspace.id ? "bg-blue-50 text-black w-full" : "text-muted-foreground w-full"
                                        }`}  // Condition pour appliquer le fond bleu si c'est le workspace sélectionné
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
                                    <span>{workspace?.name}</span>

                                </DropdownMenuItem>
                                {currentWorkspace?.id === workspace.id && (
                                    <Link href={`/workspace/${workspace.id}/settings`}>
                                        <p className="flex items-center justify-center w-6 h-6 rounded-ful text-gray-800">
                                            <Settings size={14} className="ml-1" />
                                        </p>
                                    </Link>
                                )}
                            </div>

                        ))}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2" onClick={handleNewWorkspace}>
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">Add workspace</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu >
    )
}
