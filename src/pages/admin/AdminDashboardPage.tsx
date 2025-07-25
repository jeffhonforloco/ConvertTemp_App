import { AdminDashboard } from '@/components/AdminDashboard';
import { AdminLayout } from '@/components/AdminLayout';

export default function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard" description="Analytics and insights overview">
      <AdminDashboard />
    </AdminLayout>
  );
}