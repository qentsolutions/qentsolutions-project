"use client";

import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { Board } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/form-input";
import { updateBoard } from "@/actions/tasks/update-board";
import { useAction } from "@/hooks/use-action";
import { useCurrentWorkspace } from "@/hooks/use-current-workspace";

interface BoardTitleFormProps {
  data: Board;
}

export const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
  const { currentWorkspace } = useCurrentWorkspace();
  const { execute } = useAction(updateBoard, {
    onSuccess: (data) => {
      toast.success(`Board "${data.title}" updated!`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const workspaceId = currentWorkspace?.id;
    if (!workspaceId) {
      toast.error("Workspace ID is required.");
      return;
    }

    execute({
      title,
      id: data.id,
      workspaceId,
    });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  if (isEditing) {
    return (
      <form action={onSubmit} ref={formRef} className="flex items-center gap-x-2">
        <FormInput
          ref={inputRef}
          id="title"
          onBlur={onBlur}
          defaultValue={title}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-gray-50 focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    );
  }

  return (
    <Button
      onClick={enableEditing}
      variant="default"
      className="font-bold bg-transparent shadow-none text-gray-700 hover:bg-gray-100 text-lg h-auto w-auto p-1 px-2"
    >
      {title}
    </Button>
  );
};