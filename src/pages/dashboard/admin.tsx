import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  BookOpen,
  GraduationCap,
  Building2,
  AlertCircle,
  Megaphone,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { useList } from '@refinedev/core';
import { Class, User, Subject, UserRole } from '@/types';
import { useMemo } from 'react';

const mockAnnouncements = [
  {
    id: 1,
    title: 'Spring Semester Registration',
    message:
      'Registration for Spring 2026 semester begins next Monday. Ensure all faculty have updated course schedules.',
    priority: 'high',
    date: '2026-01-15',
  },
];

// Vibrant chart colors
const CHART_COLORS = {
  chart1: '#f54900', // bright orange
  chart2: '#009689', // teal
  chart3: '#104e64', // dark blue
  chart4: '#ffb900', // yellow
  chart5: '#fe9a00', // orange-yellow
};

// Array of colors for cycling through charts
const VIBRANT_COLORS = [
  CHART_COLORS.chart1,
  CHART_COLORS.chart2,
  CHART_COLORS.chart3,
  CHART_COLORS.chart4,
  CHART_COLORS.chart5,
];

export const AdminDashboard = () => {
  const navigate = useNavigate();

  // Fetch real data
  const { result: usersData, query: usersQuery } = useList<User>({
    resource: 'users',
    pagination: { mode: 'off' },
  });

  const { result: classesData, query: classesQuery } = useList<Class>({
    resource: 'classes',
    pagination: { mode: 'off' },
  });

  const { result: subjectsData, query: subjectsQuery } = useList<Subject>({
    resource: 'subjects',
    pagination: { mode: 'off' },
  });

  const isLoadingUsers = usersQuery.isLoading;
  const isLoadingClasses = classesQuery.isLoading;
  const isLoadingSubjects = subjectsQuery.isLoading;

  // Calculate stats
  const stats = useMemo(() => {
    const users = usersData?.data || [];
    const classes = classesData?.data || [];
    const subjects = subjectsData?.data || [];

    const totalStudents = users.filter((user: User) => user.role === UserRole.STUDENT).length;
    const totalFaculty = users.filter(
      (user: User) => user.role === UserRole.TEACHER || user.role === UserRole.ADMIN
    ).length;

    return {
      totalStudents,
      totalFaculty,
      totalClasses: classes.length,
      totalSubjects: subjects.length,
    };
  }, [usersData, classesData, subjectsData]);

  // Calculate students per class data
  const studentsPerClassData = useMemo(() => {
    const classes = classesData?.data || [];
    return classes
      .map((classItem: Class) => ({
        className: classItem.name,
        studentCount: classItem.students?.length || 0,
      }))
      .sort((a: { studentCount: number }, b: { studentCount: number }) => b.studentCount - a.studentCount)
      .slice(0, 12); // Top 12 classes
  }, [classesData]);

  // Calculate classes per subject data
  const classesPerSubjectData = useMemo(() => {
    const classes = classesData?.data || [];
    const subjects = subjectsData?.data || [];

    // Create a map of subjectId to count
    const subjectCounts = new Map<number, number>();
    classes.forEach((classItem: Class) => {
      const count = subjectCounts.get(classItem.subjectId) || 0;
      subjectCounts.set(classItem.subjectId, count + 1);
    });

    // Map to subject names
    return Array.from(subjectCounts.entries())
      .map(([subjectId, classCount]) => {
        const subject = subjects.find((s: Subject) => s.id === subjectId);
        return {
          subjectName: subject?.name || `Subject ${subjectId}`,
          classCount,
        };
      })
      .sort((a: { classCount: number }, b: { classCount: number }) => b.classCount - a.classCount);
  }, [classesData, subjectsData]);

  const isLoading = isLoadingUsers || isLoadingClasses || isLoadingSubjects;

  return (
    <div className='container mx-auto pb-8 px-2 sm:px-4'>
      <div className='mb-8'>
        <h1 className='text-4xl font-bold text-foreground tracking-tight'>
          Dashboard
        </h1>
        <p className='mt-2 text-muted-foreground'>
          Quick access to essential metrics and management tools.
        </p>
      </div>

      {/* Announcements Section */}
      <Card className='border-2 border-orange-600/30 bg-gradient-to-br from-orange-50 to-orange-100 shadow-md transition-shadow duration-300 mb-8 relative overflow-hidden'>
        {/* Decorative corner accent */}
        <div className='absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-bl-full' />
        <div className='absolute bottom-0 left-0 w-24 h-24 bg-orange-500/10 rounded-tr-full' />

        <CardHeader className='relative z-10'>
          <div className='flex items-center space-x-3'>
            <div className='bg-gradient-orange p-3 rounded-lg shadow-md'>
              <Megaphone className='h-6 w-6 text-white' />
            </div>
            <div>
              <CardTitle className='text-xl font-bold text-gradient-orange'>
                Important Announcements
              </CardTitle>
              <p className='text-sm text-gray-700'>Stay updated with latest information</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-3 relative z-10'>
          {mockAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className='bg-white border-l-4 border-orange-600 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:translate-x-1'
            >
              <div className='flex items-start justify-between gap-3'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2'>
                    <h3 className='font-bold text-teal-700 text-base'>
                      {announcement.title}
                    </h3>
                    {announcement.priority === 'high' && (
                      <span className='bg-gradient-orange text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm'>
                        High Priority
                      </span>
                    )}
                  </div>
                  <p className='text-sm text-gray-900 leading-relaxed mb-2'>
                    {announcement.message}
                  </p>
                  <div className='flex items-center gap-2 text-xs text-gray-900/60'>
                    <span className='font-medium'>
                      {new Date(announcement.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {announcement.priority === 'high' && (
                  <div className='bg-gradient-orange-light p-2 rounded-lg'>
                    <AlertCircle className='h-6 w-6 text-orange-600' />
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className='border border-border bg-card mb-8'>
        <CardHeader>
          <CardTitle className='text-card-foreground'>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          <Button
            onClick={() => navigate('/subjects/create')}
            size='lg'
            className='w-full cursor-pointer justify-start h-12 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-orange-diagonal'
          >
            <div className='mr-2 p-1.5 rounded-md bg-white/20'>
              <Building2 className='h-4 w-4' />
            </div>
            Add Subject
          </Button>
          <Button
            onClick={() => navigate('/classes/create')}
            size='lg'
            className='w-full cursor-pointer justify-start h-12 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-teal'
          >
            <div className='mr-2 p-1.5 rounded-md bg-white/20'>
              <BookOpen className='h-4 w-4' />
            </div>
            Add Class
          </Button>
          <Button
            onClick={() => navigate('/join-classes')}
            size='lg'
            className='w-full cursor-pointer justify-start h-12 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-orange-light2'
          >
            <div className='mr-2 p-1.5 rounded-md bg-white/20'>
              <Users className='h-4 w-4' />
            </div>
            Join Class
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <Card className='border flex flex-col gap-1 border-border bg-card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-medium text-card-foreground'>
              Total Students
            </CardTitle>
            <div className='p-2 rounded-lg bg-orange-600/10'>
              <GraduationCap className='h-4 w-4 text-orange-600' />
            </div>
          </CardHeader>
          <CardContent className='mt-0'>
            <div className='text-3xl font-bold text-orange-600'>
              {isLoading ? '...' : stats.totalStudents}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              Registered students
            </p>
          </CardContent>
        </Card>

        <Card className='border flex flex-col gap-1 border-border bg-card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-medium text-card-foreground'>
              Faculty
            </CardTitle>
            <div className='p-2 rounded-lg bg-teal-500/10'>
              <Users className='h-4 w-4 text-teal-500' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-teal-500'>
              {isLoading ? '...' : stats.totalFaculty}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              Active teachers & admins
            </p>
          </CardContent>
        </Card>

        <Card className='border flex flex-col gap-1 border-border bg-card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-medium text-card-foreground'>
              Classes
            </CardTitle>
            <div className='p-2 rounded-lg bg-teal-700/10'>
              <BookOpen className='h-4 w-4 text-teal-700' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-teal-700'>
              {isLoading ? '...' : stats.totalClasses}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>Active classes</p>
          </CardContent>
        </Card>

        <Card className='border flex flex-col gap-1 border-border bg-card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-medium text-card-foreground'>
              Subjects
            </CardTitle>
            <div className='p-2 rounded-lg bg-orange-400/10'>
              <Building2 className='h-4 w-4 text-orange-400' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-orange-400'>
              {isLoading ? '...' : stats.totalSubjects}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              Available subjects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Students Per Class */}
        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>
              Students Enrolled Per Class
            </CardTitle>
            <p className='text-sm text-muted-foreground'>
              Number of students in each class (Top 12)
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='h-[400px] flex items-center justify-center text-muted-foreground'>
                Loading chart data...
              </div>
            ) : studentsPerClassData.length === 0 ? (
              <div className='h-[400px] flex items-center justify-center text-muted-foreground'>
                No class data available
              </div>
            ) : (
              <ResponsiveContainer width='100%' height={400}>
                <BarChart data={studentsPerClassData} layout='vertical'>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    className='stroke-gray-200'
                  />
                  <XAxis type='number' className='text-xs text-gray-900' />
                  <YAxis
                    dataKey='className'
                    type='category'
                    className='text-[11px] text-gray-900'
                    width={150}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      color: '#171717',
                    }}
                  />
                  <Bar
                    dataKey='studentCount'
                    fill={CHART_COLORS.chart1}
                    name='Students'
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Classes Per Subject */}
        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='text-card-foreground'>
              Classes Per Subject
            </CardTitle>
            <p className='text-sm text-muted-foreground'>
              Number of classes offered for each subject
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='h-[400px] flex items-center justify-center text-muted-foreground'>
                Loading chart data...
              </div>
            ) : classesPerSubjectData.length === 0 ? (
              <div className='h-[400px] flex items-center justify-center text-muted-foreground'>
                No subject data available
              </div>
            ) : (
              <ResponsiveContainer width='100%' height={400}>
                <PieChart>
                  <Pie
                    data={classesPerSubjectData}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ subjectName, classCount }) =>
                      `${subjectName} (${classCount})`
                    }
                    innerRadius={70}
                    outerRadius={120}
                    dataKey='classCount'
                    className='text-[11px]'
                    nameKey='subjectName'
                  >
                    {classesPerSubjectData.map((_, index) => {
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={VIBRANT_COLORS[index % VIBRANT_COLORS.length]}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      color: '#171717',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
