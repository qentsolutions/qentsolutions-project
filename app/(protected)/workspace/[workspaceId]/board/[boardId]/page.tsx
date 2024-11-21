import { db } from "@/lib/db";
import { BoardNavbar } from "./components/board-navbar";
import { ListContainer } from "./components/list-container";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

interface BoardIdPageProps {
  params: {
    boardId: string;
    workspaceId: string;
  };
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const user = await currentUser();

  const isUserMember = await db.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: params.workspaceId,
        userId: user?.id ?? '',
      },
    },
  });

  // Si l'utilisateur n'est pas membre du workspace, retournez une page d'erreur
  if (!isUserMember) {
    // redirect to board
    redirect(`/workspace/${params.workspaceId}/board`);
  }

  // Récupérer les données du board
  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      workspaceId: params.workspaceId,
    },
    include: {
      lists: {
        include: {
          cards: {
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!board) {
    return <div>Board not found</div>;
  }

  return (
    <div className="bg-white">
      <main className="relative  h-full mx-auto max-w-6xl p-4">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-x-2 text-lg font-semibold mb-6">
            <div className="flex items-center gap-2">
              <span className="text-blue-500">Boards</span>
              <span className="text-neutral-400">/</span>
              <BoardNavbar board={board} />
            </div>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-700">Timeline:</span>
              <span className="text-sm">Nov 14, 2024 - Dec 14 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-700">Assignees:</span>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <nav className="flex gap-4 text-sm">
              <a href="#" className="text-neutral-400">Overview</a>
              <a href="#" className="text-neutral-400">List</a>
              <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Board</a>
              <a href="#" className="text-neutral-400">Timeline</a>
              <a href="#" className="text-neutral-400">Calendar</a>
              <a href="#" className="text-neutral-400">Review</a>
            </nav>
            <div className="ml-auto">
              <input
                type="search"
                placeholder="Search for a card ID"
                className="px-4 py-2 text-sm border rounded-md w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <ListContainer boardId={board?.id} data={board.lists} />

          </div>
        </div>
      </main>
    </div>
  );
};

export default BoardIdPage;
