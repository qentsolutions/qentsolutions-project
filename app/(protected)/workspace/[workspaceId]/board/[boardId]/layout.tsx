import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BoardNavbar } from "./_components/board-navbar";

const BoardIdLayout = async ({
  children,
  params,
  workspaceId,
}: {
  children: React.ReactNode;
  params: { boardId: string };
  workspaceId: string;
}) => {
  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      workspaceId,
    },
  });

  if (!board) {
    notFound();
  }

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
    >
      <BoardNavbar data={board} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
};

export default BoardIdLayout;
