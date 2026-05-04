import Topbar from '@/components/layout/Topbar'
import Sidebar from '@/components/layout/Sidebar'

// Pure shell layout — no server-side data fetching.
// Topbar and Sidebar are fully self-contained client components that
// fetch their own data via useEffect, eliminating all hydration mismatches.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col" style={{ height: '100vh', overflow: 'hidden', background: 'var(--bg0)' }}>
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden flex flex-col">
          {children}
        </main>
      </div>
    </div>
  )
}
