"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FormPopover } from "@/components/form/form-popover";
import { useCurrentWorkspace } from "@/hooks/use-current-workspace";

type Board = {
  id: string;
  title: string;
  imageThumbUrl: string;
};

export const BoardList = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentWorkspace } = useCurrentWorkspace();
  const workspaceId = currentWorkspace?.id;

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch("/api/boards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workspaceId }),
        });
        if (!response.ok) throw new Error("Failed to fetch boards");
        const data = await response.json();
        setBoards(data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [workspaceId]);

  if (loading) {
    return <SkeletonBoardList />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="h-6 w-6 mr-2" />
        Your boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`board/${board.id}`}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white">{board.title}</p>
          </Link>
        ))}
        {workspaceId && (
          <FormPopover sideOffset={10} side="right" workspaceId={workspaceId}>
            <div
              role="button"
              className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
            >
              <p className="text-sm">Create new board</p>
            </div>
          </FormPopover>
        )}
      </div>
    </div>
  );
};

const SkeletonBoardList = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    <Skeleton className="aspect-video h-full w-full p-2" />
    <Skeleton className="aspect-video h-full w-full p-2" />
    <Skeleton className="aspect-video h-full w-full p-2" />
    <Skeleton className="aspect-video h-full w-full p-2" />
    <Skeleton className="aspect-video h-full w-full p-2" />
    <Skeleton className="aspect-video h-full w-full p-2" />
    <Skeleton className="aspect-video h-full w-full p-2" />
    <Skeleton className="aspect-video h-full w-full p-2" />
  </div>
);
