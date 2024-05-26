import AdminSidebar from "../components/admin-sidebar"

export default function AdminDashboardProjectPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 mx-4">Admin Dashboard Project Page</div>
    </div>
  )
}
