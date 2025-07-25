import { UserManagement } from '@/components/UserManagement';
import { AdminLayout } from '@/components/AdminLayout';

export default function AdminUsersPage() {
  return (
    <AdminLayout title="User Management" description="Manage user accounts and permissions">
      <UserManagement />
    </AdminLayout>
  );
}