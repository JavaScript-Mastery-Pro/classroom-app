import { ListView } from '@/components/refine-ui/views/list-view';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMemo, useState } from 'react';
import { CreateButton } from '@/components/refine-ui/buttons/create';
import { useTable } from '@refinedev/react-table';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useNavigation, useList } from '@refinedev/core';
import { Subject, User, Class } from '@/types';
import { cn } from '@/lib/utils';

export const ClassesList = () => {
  const { edit } = useNavigation();
  const [globalFilter, setGlobalFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [teacherFilter, setTeacherFilter] = useState<string>('all');

  // Fetch subjects for filter dropdown
  const { query: subjectsQuery } = useList<Subject>({
    resource: 'subjects',
    pagination: {
      pageSize: 100,
    },
  });

  // Fetch teachers (users with role = teacher) for filter dropdown
  const { query: teachersQuery } = useList<User>({
    resource: 'users',
    filters: [
      {
        field: 'role',
        operator: 'eq',
        value: 'teacher',
      },
    ],
    pagination: {
      pageSize: 100,
    },
  });

  const subjects = subjectsQuery.data?.data || [];
  const teachers = teachersQuery.data?.data || [];

  const columns = useMemo<ColumnDef<Class>[]>(
    () => [
      {
        id: 'banner',
        accessorKey: 'bannerUrl',
        size: 80,
        header: () => (
          <div className='flex ml-2 font-bold items-center gap-1'>Banner</div>
        ),
        cell: ({ getValue }) => {
          const bannerUrl = getValue<string>();
          return (
            <div className='ml-4 relative flex-shrink-0'>
              <img
                src={bannerUrl}
                alt='Banner preview'
                className='size-15 object-cover object-right transition-all rounded-sm shadow-lg'
              />
            </div>
          );
        },
      },
      {
        id: 'name',
        accessorKey: 'name',
        size: 300,
        header: () => (
          <div className='flex ml-2 font-bold items-center gap-1'>
            Class Name
          </div>
        ),
        cell: ({ getValue }) => {
          const name = getValue<string>();
          return (
            <div className='ml-2 py-3 text-foreground font-bold'>{name}</div>
          );
        },
      },
      {
        id: 'status',
        accessorKey: 'status',
        size: 100,
        header: () => (
          <div className='flex font-bold items-center gap-1'>Status</div>
        ),
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <Badge
              variant='secondary'
              className={cn(
                'px-2 capitalize py-1 rounded-md text-xs font-semibold',
                status === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-400 text-white'
              )}
            >
              {status}
            </Badge>
          );
        },
      },
      {
        id: 'subject',
        accessorKey: 'subject',
        size: 200,
        header: () => (
          <div className='flex font-bold items-center gap-1'>Subject</div>
        ),
        cell: ({ row }) => {
          const subject = row.original.subject;
          return (
            <span className='py-10 text-teal-600 font-bold'>
              {subject?.name}
            </span>
          );
        },
      },
      {
        id: 'teacher',
        accessorKey: 'teacher',
        size: 100,
        header: () => (
          <div className='flex font-bold items-center gap-1'>Teacher</div>
        ),
        cell: ({ row }) => {
          const teacher = row.original.teacher;
          return (
            <span className='text-foreground font-semibold'>
              {teacher?.name}
            </span>
          );
        },
      },
      {
        id: 'capacity',
        accessorKey: 'capacity',
        size: 80,
        header: () => (
          <div className='flex font-bold items-center gap-1'>Capacity</div>
        ),
        cell: ({ getValue }) => {
          const capacity = getValue<number>();
          return (
            <span className='text-foreground font-medium'>{capacity}</span>
          );
        },
      },
    ],
    []
  );

  const table = useTable<Class>({
    columns,
    refineCoreProps: {
      resource: 'classes',
      pagination: {
        pageSize: 10,
        mode: 'server',
      },
      filters: {
        permanent: [
          ...(subjectFilter !== 'all'
            ? [
                {
                  field: 'subjectId',
                  operator: 'eq' as const,
                  value: Number(subjectFilter),
                },
              ]
            : []),
          ...(teacherFilter !== 'all'
            ? [
                {
                  field: 'teacherId',
                  operator: 'eq' as const,
                  value: teacherFilter,
                },
              ]
            : []),
          ...(globalFilter
            ? [
                {
                  field: 'name',
                  operator: 'contains' as const,
                  value: globalFilter,
                },
              ]
            : []),
        ],
      },
    },
  });

  return (
    <ListView className='container mx-auto pb-8 px-2 sm:px-4'>
      <Breadcrumb />

      <div className='space-y-4 mb-6'>
        <h1 className='text-4xl font-bold text-foreground tracking-tight'>
          Classes
        </h1>
        <div className='flex flex-col gap-5 lg:flex-row justify-between'>
          <p className='mt-2'>Manage and organize all classes.</p>

          <div className='flex flex-col gap-3 sm:flex-row sm:gap-2 w-full sm:w-auto'>
            {/* Search Input */}
            <div className='relative max-h-9 w-full md:max-w-72'>
              <Search className='absolute left-3 text-orange-600 top-1/2 -translate-y-1/2 h-4 w-4' />
              <Input
                type='text'
                placeholder='Search by name...'
                className='pl-10 bg-white w-full'
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>

            {/* Filter and Create Button Row */}
            <div className='flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className='flex-1 w-full bg-white text-orange-600 sm:flex-initial sm:w-[180px] h-11'>
                  <SelectValue placeholder='Filter by subject' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Subjects</SelectItem>
                  {subjects.map((subject: Subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.code} - {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={teacherFilter} onValueChange={setTeacherFilter}>
                <SelectTrigger className='flex-1 w-full bg-white text-orange-600 sm:flex-initial sm:w-[180px] h-11'>
                  <SelectValue placeholder='Filter by teacher' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Teachers</SelectItem>
                  {teachers.map((teacher: User) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <CreateButton
                resource='classes'
                className='h-9 bg-gradient-orange-diagonal shrink-0'
              />
            </div>
          </div>
        </div>
      </div>

      <Card className='w-full px-4 relative'>
        <div className='absolute top-0 rounded-t-lg left-0 right-0 h-2 bg-gradient-orange' />
        <DataTable
          table={table}
          onRowClick={(classItem) => {
            edit('classes', classItem.id);
          }}
        />
      </Card>
    </ListView>
  );
};
