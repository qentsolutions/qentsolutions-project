interface WorkspaceLayoutProps {
    children: React.ReactNode;
    params: {
      workspaceId: string;
    };
  }
  
  const WorkspaceLayout = ({ children, params }: WorkspaceLayoutProps) => {
    return (
      <div className="h-full">
        {children}
      </div>
    );
  };
  
  export default WorkspaceLayout;