import AdminSidebar from "@/components/layout/admin-sidebar";
import AdminHeader from "@/components/layout/admin-header";

export default function AdminDashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/80 dark:bg-muted/40">
      <AdminSidebar />
      <AdminHeader />
      {children}
    </div>
  );
}