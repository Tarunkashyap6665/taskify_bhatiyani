import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "./ui/sidebar";
import { Badge } from "./ui/badge";
import { ListTodo, BarChart3 } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout = ({ children, activeTab, onTabChange }: LayoutProps) => {
  const pageTitle = activeTab === "analytics" ? "Analytics" : "Tasks";

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon" className="border-r">
        <SidebarHeader>
          
        <div className="flex gap-2 py-2 text-sidebar-accent-foreground ">
          <div className="flex aspect-square size-8 items-center justify-center ">
            <img
              src="/taskify-logo.svg"
              alt="logo"
              width={192}
              height={192}
              className="w-8 h-8 object-cover object-center aspect-square"
            />
          </div>
          <a href={"/"}>
            <div className="grid flex-1 items-center text-left text-sm leading-tight">
              <span className="truncate font-bold text-lg">Taskify</span>
            </div>
          </a>
        </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => onTabChange("tasks")}
                    isActive={activeTab === "tasks"}
                    tooltip="Tasks"
                  >
                    <ListTodo />
                    <span>Tasks</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => onTabChange("analytics")}
                    isActive={activeTab === "analytics"}
                    tooltip="Analytics"
                  >
                    <BarChart3 />
                    <span>Analytics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>


        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="!m-0 !rounded-none">
        <div className="border-b">
          <div className="container flex h-14 items-center gap-3">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <span className="font-semibold">{pageTitle}</span>
              {activeTab === "tasks" && (
                <Badge variant="outline">Manage</Badge>
              )}
              {activeTab === "analytics" && (
                <Badge variant="outline">Reports</Badge>
              )}
            </div>
           
          </div>
        </div>

        <main className="container px-4 py-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>

        {/* <footer className="border-t fixed bottom-0 py-6 md:py-0 w-full">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Taskify. All rights reserved.
            </p>
          </div>
        </footer> */}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
