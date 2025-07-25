import { AdminSettings } from '@/components/AdminSettings';
import { AdminLayout } from '@/components/AdminLayout';

export default function AdminSettingsPage() {
  return (
    <AdminLayout title="Settings" description="Configure application settings and preferences">
      <AdminSettings />
    </AdminLayout>
  );
}