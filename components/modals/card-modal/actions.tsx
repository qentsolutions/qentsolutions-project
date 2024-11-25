"use client";

import { toast } from "sonner";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { CardWithList } from "@/types";
import { useAction } from "@/hooks/use-action";
import { copyCard } from "@/actions/tasks/copy-card";
import { deleteCard } from "@/actions/tasks/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCardModal } from "@/hooks/use-card-modal";
import { useCurrentWorkspace } from "@/hooks/use-current-workspace";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addTagToCard } from "@/actions/tasks/add-tag-to-card";
interface ActionsProps {
  data: CardWithList;
  availableTags: { id: string; name: string }[]; // Tags disponibles dans le board
}

export const Actions = ({
  data,
  availableTags,
}: ActionsProps) => {
  const params = useParams();
  const cardModal = useCardModal();
  const { currentWorkspace } = useCurrentWorkspace();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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

  const {
    execute: executeAddTagToCard,
    isLoading: isLoadingAddTag,
  } = useAction(addTagToCard, {
    onSuccess: () => {
      toast.success("Tag added to card successfully");
      setSelectedTag(null); // Réinitialiser le select après succès
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

  const onAddTag = () => {
    const boardId = params.boardId as string;
    const workspaceId = currentWorkspace?.id;

    if (!workspaceId) {
      toast.error("Workspace ID is required.");
      return;
    }
    if (!selectedTag) {
      toast.error("Please select a tag to add.");
      return;
    }

    executeAddTagToCard({
      cardId: data.id,
      tagId: selectedTag,
      boardId,
      workspaceId,
    });
  };

  return (
    <div className="space-y-4 mt-2">
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
      <div>
        <p className="text-xs font-semibold mb-2">Add Tag</p>
        <Select
          onValueChange={setSelectedTag}
          disabled={isLoadingAddTag}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a tag" />
          </SelectTrigger>
          <SelectContent>
            {}
            {availableTags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id}>
                {tag.name}
              </SelectItem>
            ))}

          </SelectContent>
        </Select>
        <Button
          onClick={onAddTag}
          disabled={isLoadingAddTag || !selectedTag}
          variant="outline"
          className="w-full mt-2 justify-center"
          size="default"
        >
          Add Tag
        </Button>
      </div>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-4 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-12 bg-neutral-200" />
    </div>
  );
};
