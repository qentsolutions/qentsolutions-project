"use client";

import { toast } from "sonner";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";

import { CardWithList } from "@/types";
import { useAction } from "@/hooks/use-action";
import { copyCard } from "@/actions/tasks/copy-card";
import { Button } from "@/components/ui/button";
import { deleteCard } from "@/actions/tasks/delete-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCardModal } from "@/hooks/use-card-modal";
import { useCurrentWorkspace } from "@/hooks/use-current-workspace";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ActionsProps {
  data: CardWithList;
};

export const Actions = ({
  data,
}: ActionsProps) => {
  const params = useParams();
  const cardModal = useCardModal();
  const { currentWorkspace } = useCurrentWorkspace();

  const {
    execute: executeCopyCard,
    isLoading: isLoadingCopy,
  } = useAction(copyCard, {
    onSuccess: (data) => {
      toast.success(`Card "${data.title}" copied`);
      cardModal.onClose();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const {
    execute: executeDeleteCard,
    isLoading: isLoadingDelete,
  } = useAction(deleteCard, {
    onSuccess: (data) => {
      toast.success(`Card "${data.title}" deleted`);
      cardModal.onClose();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onCopy = () => {
    const boardId = params.boardId as string;
    const workspaceId = currentWorkspace?.id;
    if (!workspaceId) {
      toast.error("Workspace ID is required.");
      return;
    }
    executeCopyCard({
      id: data.id,
      boardId,
      workspaceId,
    });
  };

  const onDelete = () => {
    const boardId = params.boardId as string;
    const workspaceId = currentWorkspace?.id;
    if (!workspaceId) {
      toast.error("Workspace ID is required.");
      return;
    }
    executeDeleteCard({
      id: data.id,
      boardId,
      workspaceId,
    });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">
        Actions
      </p>
      <Button
        onClick={onCopy}
        disabled={isLoadingCopy}
        variant="outline"
        className="w-full justify-start"
        size="default"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Dialog>
        <DialogTrigger className="w-full">
          <Button
            variant="outline"
            className="w-full justify-start"
            size="default"
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <p className="text-base text-muted-foreground mb-4">
            Are you sure you want to delete this card? This action is irreversible.
          </p>
          <div className="flex items-center">
            <Button
              onClick={(e) => {
                e.stopPropagation(); 
                onDelete();
              }}
              disabled={isLoadingDelete}
              variant="destructive"
              className="w-full justify-center mr-8"
              size="default"
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <DialogClose className="w-full">
              <Button
                variant="outline"
                className="w-full justify-center cursor-pointer"
                size="default"
              >
                Cancel
              </Button>
            </DialogClose>
          
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
