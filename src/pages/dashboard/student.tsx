import { useGetIdentity, useList } from '@refinedev/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, Clock } from 'lucide-react';
import { User, ClassSchedule } from '@/types';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { formatTime12Hour } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClassCard } from '@/components/refine-ui/layout/class-card';

export const StudentDashboard = () => {
  const { data: identity } = useGetIdentity<User>();
  const navigate = useNavigate();

  // Fetch all classes with student enrollments
  const { result: enrollments, query: classesQuery } = useList({
    resource: 'enrollments',
    pagination: { mode: 'off' },
    filters: [
      {
        field: 'studentId',
        operator: 'eq',
        value: identity?.id,
      },
    ],
  });

  const isLoading = classesQuery.isLoading;
  const enrolledClasses = enrollments.data;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Get today's schedule
  const todaysSchedule = useMemo(() => {
    return enrolledClasses
      .flatMap((classItem) => {
        const todaySchedules =
          classItem.class.schedules?.filter(
            (s: ClassSchedule) => s.day === today
          ) || [];
        return todaySchedules.map((schedule: ClassSchedule) => ({
          classItem,
          schedule,
        }));
      })
      .sort((a, b) => {
        const timeA = a.schedule.startTime || '';
        const timeB = b.schedule.startTime || '';
        return timeA.localeCompare(timeB);
      });
  }, [enrolledClasses, today]);

  console.log('Enrolled classes:', enrolledClasses);
  console.log('Todays Schedule:', todaysSchedule);
  console.log('enrollments:', enrollments);

  if (isLoading) {
    return (
      <div className='container mx-auto pb-8 px-2 sm:px-4'>
        <div className='flex h-96 items-center justify-center'>
          <p className='text-muted-foreground'>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto pb-8 px-2 sm:px-4'>
      {/* Welcome Header */}
      <div className='mb-8'>
        <h1 className='text-4xl font-bold text-foreground tracking-tight'>
          Welcome back, {identity?.name?.split(' ')[0] || 'Student'}!
        </h1>
        <p className='text-muted-foreground mt-2'>
          You're enrolled in {enrolledClasses.length}{' '}
          {enrolledClasses.length === 1 ? 'class' : 'classes'} this semester
        </p>
      </div>

      {/* Today's Schedule */}
      {todaysSchedule.length > 0 && (
        <Card className='border border-border bg-card mb-8'>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <div className='p-3 rounded-lg bg-teal-500/10'>
                <Calendar className='h-5 w-5 text-teal-500' />
              </div>
              <div>
                <CardTitle className='text-teal-600'>
                  Today's Schedule - {today}
                </CardTitle>
                <p className='text-sm text-muted-foreground'>
                  Your classes scheduled for today
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {todaysSchedule.map((item, index) => {
                const classData = item.classItem.class;

                console.log('Rendering today schedule item:', item);
                return (
                  <div
                    key={index}
                    className='flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/30 transition-all '
                    onClick={() =>
                      navigate(`/classes/show/${item.classItem.id}`)
                    }
                  >
                    <div className='bg-gradient-teal h-full w-fit p-4 rounded-md text-white'>
                      {item.schedule.day}
                    </div>
                    <div className='w-full'>
                      <h4 className='font-semibold text-foreground mb-1'>
                        {classData.name}
                      </h4>
                      <div className='flex items-center gap-2 mt-2'>
                        <Badge variant='outline' className='text-xs'>
                          <Clock className='h-3 w-3 mr-1' />
                          {formatTime12Hour(item.schedule.startTime)} -{' '}
                          {formatTime12Hour(item.schedule.endTime)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enrolled Classes */}
      <Card className='border border-border bg-card'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <div className='p-3 rounded-lg bg-orange-500/10'>
              <BookOpen className='h-5 w-5 text-orange-600' />
            </div>
            <div>
              <CardTitle className='text-orange-600'>My Classes</CardTitle>
              <p className='text-sm text-muted-foreground'>
                All classes you're currently enrolled in
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {enrolledClasses.length === 0 ? (
            <div className='text-center py-12'>
              <BookOpen className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
              <p className='text-foreground text-lg font-medium mb-2'>
                No classes enrolled yet
              </p>
              <p className='text-muted-foreground text-sm mb-6'>
                Start by joining classes using their invite codes
              </p>
              <Button
                onClick={() => navigate('/enrollments')}
                className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
              >
                Browse Available Classes
              </Button>
            </div>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
              {enrolledClasses.map((enrolledClass) => {
                const classItem = enrolledClass.class;
                console.log('Rendering class item:', classItem);
                return <ClassCard key={classItem.id} classItem={classItem} />;
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
