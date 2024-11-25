"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { AddTagToCard } from "./schema";
import { InputType, ReturnType } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { currentUser } from "@/lib/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
  const user = currentUser();

  if (!user) {
    throw new Error("Unauthorized: User not found!");
  }

  const { cardId, workspaceId, tagId, boardId } = data;

  try {
    // Mise à jour de la carte pour associer le tag
    const updatedCard = await db.card.update({
      where: {
        id: cardId,
        list: {
          board: {
            workspaceId,
          },
        },
      },
      data: {
        tags: {
          connect: { id: tagId },
        },
      },
    });

    // Créer un audit log pour l'ajout du tag
    await createAuditLog({
      entityTitle: updatedCard.title,
      entityId: updatedCard.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.UPDATE,
      workspaceId,
    });

    // Réactualiser la page pour refléter les changements
    revalidatePath(`/workspace/${workspaceId}/board/${boardId}`);
    return { data: updatedCard };
  } catch (error) {
    console.error("Error adding tag to card:", error);
    return {
      error: "Failed to add tag to card.",
    };
  }
};

export const addTagToCard = createSafeAction(AddTagToCard, handler);
