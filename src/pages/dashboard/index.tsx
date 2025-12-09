import { useGetIdentity } from '@refinedev/core';
import { AdminDashboard } from './admin';
import type { User } from '@/types';
import { StudentDashboard } from './student';

export const Dashboard = () => {
  const { data: identity, isLoading } = useGetIdentity<User>();
  console.log('Dashboard identity:', identity);
  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <p className='text-muted-foreground'>Loading dashboard...</p>
      </div>
    );
  }

  // Render role-specific dashboard
  if (identity?.role === 'student') {
    return <StudentDashboard />;
  }

  // Default to Admin dashboard
  return <AdminDashboard />;
};
