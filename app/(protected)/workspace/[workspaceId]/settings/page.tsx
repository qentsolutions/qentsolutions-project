"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentWorkspace } from "@/hooks/use-current-workspace";
import { updateWorkspace } from "@/actions/workspace";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Separator } from "@/components/ui/separator";

const UpdateWorkspaceSchema = z.object({
    name: z.string().min(1, "Workspace name is required"),
});

const WorkspaceSettingsPage = () => {
    const { currentWorkspace, setCurrentWorkspace } = useCurrentWorkspace();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const form = useForm<z.infer<typeof UpdateWorkspaceSchema>>({
        resolver: zodResolver(UpdateWorkspaceSchema),
        defaultValues: {
            name: currentWorkspace?.name || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof UpdateWorkspaceSchema>) => {
        setError(undefined);
        setSuccess(undefined);

        if (!currentWorkspace) return;

        const result = await updateWorkspace({
            ...values,
            workspaceId: currentWorkspace.id,
        });

        if (result.error) {
            setError(result.error);
            return;
        }

        if (result.workspace) {
            setCurrentWorkspace({
                ...result.workspace,
                members: [], // Add an empty array or provide the appropriate value for the members property
                createdAt: result.workspace.createdAt.toISOString(), // Convert the createdAt property to a string
            });
            setSuccess("Workspace updated successfully!");
        }
    };

    if (!currentWorkspace) {
        return null;
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            </div>
            <Separator />
            <Card className="w-full max-w-[600px]">
                <CardHeader>
                    <h3 className="text-xl font-semibold">Workspace Settings</h3>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Workspace Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="My Workspace"
                                                disabled={form.formState.isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormError message={error} />
                            <FormSuccess message={success} />
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                Save Changes
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default WorkspaceSettingsPage;