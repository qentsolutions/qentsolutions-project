"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";

const WorkspaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const createWorkspace = async (
  values: z.infer<typeof WorkspaceSchema>
) => {
  try {
    const validatedFields = WorkspaceSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const user = await currentUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    const workspace = await db.workspace.create({
      data: {
        name: values.name,
        createdById: user.id,
        members: {
          create: {
            userId: user.id,
            role: UserRole.ADMIN,
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    return { workspaceId: workspace.id };
  } catch (error) {
    // Retourner un message d'erreur simple (et non un objet Error)
    return {
      error: error instanceof Error ? error.message : "Something went wrong!",
    };
  }
};

export const getUserWorkspaces = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    const workspaces = await db.workspace.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        members: {
          select: {
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return {
      workspaces: workspaces.map((workspace) => ({
        ...workspace,
        createdAt: workspace.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};
