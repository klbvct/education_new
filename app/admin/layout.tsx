import AdminSidebar from '../../components/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="min-h-screen min-w-0 flex-1 lg:ml-64">
        <div className="p-4 pt-16 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
