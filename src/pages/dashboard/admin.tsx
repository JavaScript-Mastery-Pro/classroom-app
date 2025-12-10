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

const QUICK_ACTIONS = [
  {
    title: 'Add Subject',
    description: 'Create a new subject',
    icon: Building2,
    link: '/subjects/create',
  },
  {
    title: 'Add Class',
    description: 'Create a new class',
    icon: BookOpen,
    link: '/classes/create',
  },
  {
    title: 'Join Class',
    description: 'Join a class using code',
    icon: Users,
    link: '/join-classes',
  },
];

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
  chart1: '#7F56D9',
  chart2: '#9E77ED',
  chart3: '#B692F6',
  chart4: '#6C49BA',
  chart5: '#6033C5',
  chart6: '#4B2F8A',
};

// Array of colors for cycling through charts
const COLORS = [
  CHART_COLORS.chart1,
  CHART_COLORS.chart2,
  CHART_COLORS.chart3,
  CHART_COLORS.chart4,
  CHART_COLORS.chart5,
  CHART_COLORS.chart6,
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

    const totalStudents = users.filter(
      (user: User) => user.role === UserRole.STUDENT
    ).length;
    const totalFaculty = users.filter(
      (user: User) =>
        user.role === UserRole.TEACHER || user.role === UserRole.ADMIN
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
      .sort(
        (a: { studentCount: number }, b: { studentCount: number }) =>
          b.studentCount - a.studentCount
      )
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
      .sort(
        (a: { classCount: number }, b: { classCount: number }) =>
          b.classCount - a.classCount
      );
  }, [classesData, subjectsData]);

  const isLoading = isLoadingUsers || isLoadingClasses || isLoadingSubjects;

  return (
    <div className='container mx-auto pb-6 px-2 sm:px-4'>
      <div className='mb-5'>
        <h1 className='text-3xl font-semibold text-gray-900'>Dashboard</h1>
        <p className='mt-2 text-gray-700'>
          Quick access to essential metrics and management tools.
        </p>
      </div>

      {/* Announcements Section */}
      <Card className='border-2 shadow-none border-orange-600/30 bg-orange-100 mb-7 relative overflow-hidden'>
        <CardHeader className='flex items-center space-x-2'>
          <div className='bg-gradient-orange p-3 rounded-lg shadow-md'>
            <Megaphone className='h-5 w-5 text-white' />
          </div>
          <div>
            <CardTitle className='text-lg font-bold text-gradient-orange'>
              Important Announcements
            </CardTitle>
            <p className='text-sm text-gray-700'>
              Stay updated with latest information
            </p>
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
                    <h3 className='font-bold text-gray-700 text-base'>
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
      <section className='grid mb-7 grid-cols-1 md:grid-cols-3 gap-5'>
        {QUICK_ACTIONS.map((action) => (
          <Button
            onClick={() => navigate(action.link)}
            size='lg'
            className='w-full border bg-orange-100/20 border-gray-200 cursor-pointer h-20 font-medium text-gray-900 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-orange-100/20 hover:border-orange-500/30 rounded-xl'
          >
            <div className='mr-2 p-3 rounded-full bg-orange-100'>
              <action.icon className='h-4 w-4' />
            </div>
            <div className='flex text-start w-full flex-start flex-col'>
              <p className='font-bold text-gray-700 text-base'>
                {action.title}
              </p>
              <p className='text-gray-600 text-sm'>{action.description}</p>
            </div>
          </Button>
        ))}
      </section>

      {/* Stats */}
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-7'>
        <Card className='flex flex-col gap-1 border border-gray-200'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='ont-bold text-gray-700 text-base'>
              Total Students
            </CardTitle>
            <GraduationCap className='h-6 w-6 text-orange-500' />
          </CardHeader>
          <CardContent className='mt-1'>
            <div className='text-4xl font-bold text-gray-900'>
              {isLoading ? '...' : stats.totalStudents}
            </div>
            <p className='text-xs text-gray-700 mt-2'>Registered students</p>
          </CardContent>
        </Card>

        <Card className='flex flex-col gap-1 border border-gray-200'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='ont-bold text-gray-700 text-base'>
              Faculty
            </CardTitle>
            <Users className='h-6 w-6 text-orange-500' />
          </CardHeader>
          <CardContent className='mt-1'>
            <div className='text-4xl font-bold text-gray-900'>
              {isLoading ? '...' : stats.totalFaculty}
            </div>
            <p className='text-xs text-gray-700 mt-2'>
              Active teachers & admins
            </p>
          </CardContent>
        </Card>

        <Card className='flex flex-col gap-1 border border-gray-200'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='ont-bold text-gray-700 text-base'>
              Classes
            </CardTitle>
            <BookOpen className='h-6 w-6 text-orange-500' />
          </CardHeader>
          <CardContent className='mt-1'>
            <div className='text-4xl font-bold text-gray-900'>
              {isLoading ? '...' : stats.totalClasses}
            </div>
            <p className='text-xs text-gray-700 mt-2'>Active classes</p>
          </CardContent>
        </Card>

        <Card className='flex flex-col gap-1 border border-gray-200'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='ont-bold text-gray-700 text-base'>
              Subjects
            </CardTitle>
            <Building2 className='h-6 w-6 text-orange-500' />
          </CardHeader>
          <CardContent className='mt-1'>
            <div className='text-4xl font-bold text-gray-900'>
              {isLoading ? '...' : stats.totalSubjects}
            </div>
            <p className='text-xs text-gray-700 mt-2'>Available subjects</p>
          </CardContent>
        </Card>
      </section>

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
            <CardTitle className='text-gray-900'>Classes Per Subject</CardTitle>
            <p className='text-sm text-gray-700'>
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
                          fill={COLORS[index % COLORS.length]}
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
