import { NextResponse } from "next/server";
import { db } from "@/lib/db";  // Assurez-vous d'avoir la bonne importation pour votre base de données

// Cette fonction est appelée pour une requête GET sur la route `/api/board/[workspaceId]`
export async function GET(request: Request, { params }: { params: { workspaceId: string } }) {
  // Vérifiez si `workspaceId` est passé dans les paramètres de l'URL
  if (!params?.workspaceId) {
    return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
  }

  const { workspaceId } = params;

  try {
    // Récupérer les boards à partir de la base de données
    const boards = await db.board.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });

    if (boards.length === 0) {
      return NextResponse.json({ error: "No boards found" }, { status: 404 });
    }

    return NextResponse.json(boards);
  } catch (error) {
    console.error("Error fetching boards:", error);
    return NextResponse.json(
      { error: "Failed to fetch boards" },
      { status: 500 }
    );
  }
}
