import { ShellClient } from "@/app/_components/shell/shell-client";
import { ToastContainer } from "@/app/_components/ui/toast";
import { ModaleCreation } from "@/app/_components/ui/modale-creation";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ShellClient>{children}</ShellClient>
      <ToastContainer />
      <ModaleCreation />
    </>
  );
}
