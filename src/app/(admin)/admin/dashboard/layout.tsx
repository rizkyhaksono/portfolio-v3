import AdminSidebar from "@/components/layout/admin-sidebar";
import AdminHeader from "@/components/layout/admin-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | RH",
  description: "Built by @rizkyhaksono",
};

export default function AdminDashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/80 dark:bg-muted/40">
      <AdminSidebar />
      <AdminHeader />
      {children}
    </div>
  );
}
