import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Desktop sidebar — hidden on mobile */}
      <Sidebar />

      {/* Main content — offset by sidebar on desktop */}
      <main className="md:ml-60 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* Mobile bottom nav — hidden on desktop */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
