import { z } from "zod";
import { Card } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { CreateTag } from "./schema";

export type InputType = z.infer<typeof CreateTag>;
export type ReturnType = ActionState<InputType, Card>;
