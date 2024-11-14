"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserWorkspaces } from "@/actions/workspace";

interface Workspace {
  id: string;
  name: string;
  createdAt: string;
  members: {
    role: string;
    user: {
      id: string;
      name: string | null;
      email: string | null;
    };
  }[];
}

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  setCurrentWorkspace: (workspace: Workspace) => void;
  isLoading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        const { workspaces: loadedWorkspaces, error } = await getUserWorkspaces();
        if (loadedWorkspaces && !error) {
          setWorkspaces(loadedWorkspaces);

          // Set current workspace based on URL param or first workspace
          const workspaceId = params?.workspaceId as string;
          const currentWs = loadedWorkspaces.find(w => w.id === workspaceId) || loadedWorkspaces[0];
          setCurrentWorkspace(currentWs || null);
        }
      } catch (error) {
        console.error("Error loading workspaces:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkspaces();
  }, [params?.workspaceId]);

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        workspaces,
        setCurrentWorkspace,
        isLoading
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useCurrentWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useCurrentWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}