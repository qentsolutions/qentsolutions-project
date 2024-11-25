import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { cardId: string, workspaceId: string } }
) {
  try {
    const user = currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const card = await db.card.findUnique({
      where: {
        id: params.cardId,
        list: {
          board: {
            workspaceId : params.workspaceId,
          },
        },
      },
      include: {
        list: {
          select: {
            title: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        }, 
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}