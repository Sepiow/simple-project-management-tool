import { Suspense } from "react";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { Navbar } from "@/components/custom/navbar";
import { Sidebar } from "@/components/custom/sidebar";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
import { EditTaskModal } from "@/features/tasks/components/edit-task-modal";

export const dynamic = "force-dynamic";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen">
      <Suspense fallback={null}>
        <CreateProjectModal />
        <CreateTaskModal />
        <EditTaskModal />
      </Suspense>
      <div className="flex w-full h-full">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-66 h-full overflow-y-auto">
          <Suspense fallback={null}>
            <Sidebar />
          </Suspense>
        </div>
        <div className="lg:pl-66 w-full">
          <div className="mx-auto max-w-screen-2xl h-full">
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>
            <main className="h-full py-8 px-6 flex flex-col">
              <Suspense fallback={null}>
                {children}
              </Suspense>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;