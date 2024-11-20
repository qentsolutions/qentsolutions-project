"use client";

import { Board } from "@prisma/client";
import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";

interface BoardNavbarProps {
  board: Board;
}

export const BoardNavbar = ({ board }: BoardNavbarProps) => {
  if (!board) return null;

  return (
    <div className="w-full h-14 z-[40] bg-white/50 fixed top-14 flex items-center px-6 gap-x-4 text-neutral-700 backdrop-blur-sm">
      <BoardTitleForm data={board} />
      <div className="ml-auto">
        <BoardOptions boardId={board.id} />
      </div>
    </div>
  );
};