import { useGetIdentity } from '@refinedev/core';
// import { StudentDashboard } from './student';
import { AdminDashboard } from './admin';
// import { TeacherDashboard } from './teacher';
import type { User } from '@/types';

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
  // if (identity?.role === 'student') {
  //   return <StudentDashboard />;
  // }

  // if (identity?.role === 'teacher') {
  //   return <TeacherDashboard />;
  // }

  // Default to Admin dashboard
  return <AdminDashboard />;
};
