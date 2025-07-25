import { AdNetworkManagement } from '@/components/AdNetworkManagement';
import { AdminLayout } from '@/components/AdminLayout';

export default function AdminAdNetworksPage() {
  return (
    <AdminLayout title="Ad Networks" description="Manage advertising networks and revenue">
      <AdNetworkManagement />
    </AdminLayout>
  );
}