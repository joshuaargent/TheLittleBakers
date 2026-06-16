import { Sidebar } from '@/components/admin/layout/Sidebar';
import { Header } from '@/components/admin/layout/Header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Sidebar />
      <div className="pl-60 transition-all duration-300">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}