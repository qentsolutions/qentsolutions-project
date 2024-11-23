    import { useCurrentWorkspace } from "@/hooks/use-current-workspace";


    const WorkspaceIdPage = () => {

        const { currentWorkspace } = useCurrentWorkspace();
        
        const workspaceLogo = currentWorkspace?.logo
        const workspaceName = currentWorkspace?.name
        const workspaceMembers = currentWorkspace?.members
        

        return (
            <div>
                <h1>WorkspaceId</h1>
            </div>
        );
    }

    export default WorkspaceIdPage;