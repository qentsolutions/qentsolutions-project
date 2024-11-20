import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";

interface Props {
  entityId: string;
  entityType: ENTITY_TYPE,
  entityTitle: string;
  action: ACTION;
  workspaceId: string;
};

export const createAuditLog = async (props: Props) => {
  try {

    const { entityId, entityType, entityTitle, action, workspaceId } = props;

    await db.auditLog.create({
      data: {
        workspaceId,
        entityId,
        entityType,
        entityTitle,
        action,
        userId: "cm3puk667000bwzg9287khkh8",
        userImage: "2",
        userName: "3"
      }
    });
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error);
  }
}