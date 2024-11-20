
import { db } from "@/lib/db";
import { BoardNavbar } from "./_components/board-navbar";
import { ListContainer } from "./_components/list-container";

interface BoardIdPageProps {
  params: {
    boardId: string;
  };
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const workspaceId = "cm3puk9oe000jwzg92s4ovtch";



  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      workspaceId,
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


  return (
    <div className="relative h-full bg-white">
      <BoardNavbar board={board} />
      <main className="relative pt-28 h-full mx-auto max-w-6xl p-4">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-x-2 text-lg font-semibold mb-6">
            <div className="flex items-center gap-2">
              <span className="text-neutral-700">Projects</span>
              <span className="text-neutral-400">/</span>
              <span>{board?.title}</span>
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
          <ListContainer boardId={board?.id} data={board?.lists} />
        </div>
      </main>
    </div>
  );
};

export default BoardIdPage;