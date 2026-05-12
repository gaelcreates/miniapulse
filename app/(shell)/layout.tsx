import { Sidebar } from "@/app/_components/shell/sidebar";
import { Topbar } from "@/app/_components/shell/topbar";
import { ToastContainer } from "@/app/_components/ui/toast";
import { ModaleCreation } from "@/app/_components/ui/modale-creation";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-950">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:pl-[240px]">
        <Topbar />
        <main className="flex-1 px-6 py-8 sm:px-10 sm:py-10">{children}</main>
      </div>
      <ToastContainer />
      <ModaleCreation />
    </div>
  );
}
