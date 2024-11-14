import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>

  );
}

export default ProtectedLayout;