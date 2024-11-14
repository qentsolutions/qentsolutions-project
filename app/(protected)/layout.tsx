import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { cookies } from "next/headers";

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"



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