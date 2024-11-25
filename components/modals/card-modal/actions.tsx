import { toast } from "sonner";
import { Copy, Trash, Check, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

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
import { Badge } from "@/components/ui/badge"; // Importer le composant Badge

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

  // Gérer l'état des tags associés à la carte
  const [linkedTags, setLinkedTags] = useState<string[]>(data.tags.map(tag => tag.name));

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

      if (selectedTag) {
        // Trouver le nom du tag à partir de l'ID sélectionné
        const newTag = availableTags.find(tag => tag.id === selectedTag)?.name;

        if (newTag && !linkedTags.includes(newTag)) {
          // Ajouter le tag en temps réel à la liste des tags associés
          setLinkedTags(prevTags => [...prevTags, newTag]);
        }
      }

      // Réinitialiser le champ de sélection après ajout
      setSelectedTag(null);
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

  const onAddTag = (value: string) => {
    const boardId = params.boardId as string;
    const workspaceId = currentWorkspace?.id;

    if (!workspaceId) {
      toast.error("Workspace ID is required.");
      return;
    }
    if (!value) {
      toast.error("Please select a tag to add.");
      return;
    }

    // Ajouter le tag sélectionné immédiatement après la sélection
    executeAddTagToCard({
      cardId: data.id,
      tagId: value,
      boardId,
      workspaceId,
    });
  };

  function getRandomColor(id: string): string {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    // Utiliser l'ID du tag pour calculer un index unique
    const index = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  }

  // Gérer les changements dans la sélection de tag
  useEffect(() => {
    if (selectedTag && !linkedTags.includes(selectedTag)) {
      const newTag = availableTags.find(tag => tag.id === selectedTag)?.name;
      if (newTag && !linkedTags.includes(newTag)) {
        setLinkedTags(prevTags => [...prevTags, newTag]);
      }
    }
  }, [selectedTag, availableTags, linkedTags]);

  return (
    <div className="space-y-4 mt-2">
      <p className="text-xs font-semibold">Actions</p>
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
        <div className="flex">
           <p className="text-xs font-semibold mb-2">Tags</p>
           <Plus className="h-4 w-4 ml-1 text-muted-foreground" />
        </div>
       
        <div className="space-x-2">
          {/* Affichage des tags associés à la carte sous forme de badges */}
          {linkedTags.map((tag, index) => {
            const tagId = availableTags.find(t => t.name === tag)?.id || "";
            return (
              <Badge key={index} className={getRandomColor(tagId)}>
                {tag}
              </Badge>
            );
          })}
        </div>

        <Select
          value={selectedTag || ""}
          onValueChange={(value) => {
            setSelectedTag(value); // Mettre à jour le tag sélectionné
            onAddTag(value); // Ajouter immédiatement après la sélection
          }}
          disabled={isLoadingAddTag}
        >
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder={linkedTags.length === 0 ? "Select a tag" : linkedTags.join(", ")} />
          </SelectTrigger>
          <SelectContent>
            {availableTags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id}>
                <div className="flex items-center">
                  {tag.name}
                  {linkedTags.includes(tag.name) && <Check className="ml-2 h-4 w-4 text-green-500" />}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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