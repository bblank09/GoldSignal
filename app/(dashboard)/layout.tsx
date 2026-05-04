import dynamic from 'next/dynamic'

// ssr: false = these components never pre-render on the server.
// Eliminates all possible SSR/client HTML mismatches and the
// ActionQueueContext cascade crash on Windows fresh clones.
const Topbar  = dynamic(() => import('@/components/layout/Topbar'),  { ssr: false })
const Sidebar = dynamic(() => import('@/components/layout/Sidebar'), { ssr: false })

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
