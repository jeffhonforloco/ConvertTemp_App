import { AdminDashboard } from '@/components/AdminDashboard';
import { AdminLayout } from '@/components/AdminLayout';

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout title="Analytics" description="Detailed analytics and conversion metrics">
      <AdminDashboard />
    </AdminLayout>
  );
}