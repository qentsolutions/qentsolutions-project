"use client";

import { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";
import { useCardModal } from "@/hooks/use-card-modal";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface CardItemProps {
  data: Card;
  index: number;
}

export const CardItem = ({ data, index }: CardItemProps) => {
  const cardModal = useCardModal();

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => cardModal.onOpen(data.id)}
          className="truncate border bg-white rounded-lg shadow-sm hover:border-black"
        >
          <div className="p-3 space-y-3">
            <div className="flex items-start gap-x-2">
              <Badge variant="secondary" className="bg-red-100 text-red-700">High</Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">Marketing</Badge>
              <Badge variant="secondary" className="ml-auto">PRO-1</Badge>
            </div>
            <p className="text-sm font-medium">{data.title}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-1 text-muted-foreground text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {format(new Date(data.createdAt), "MMM d")}
              </div>
              <Avatar className="h-6 w-6">
              </Avatar>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};