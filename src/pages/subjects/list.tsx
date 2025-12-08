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
import { DataTableSorter } from '@/components/refine-ui/data-table/data-table-sorter';
import { Badge } from '@/components/ui/badge';

import { DEPARTMENT_OPTIONS } from '@/constants';
import { Card } from '@/components/ui/card';
import { useNavigation } from '@refinedev/core';
import { Subject } from '@/types';

export const SubjectsList = () => {
  const { edit } = useNavigation();
  const [globalFilter, setGlobalFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const columns = useMemo<ColumnDef<Subject>[]>(
    () => [
      {
        id: 'code',
        accessorKey: 'code',
        size: 80,
        header: ({ column }) => (
          <div className='flex ml-2 font-bold  items-center gap-1'>
            <span>Code</span>
            <DataTableSorter column={column} />
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return (
            <Badge className='ml-2 my-2 text-sm bg-orange-50 text-orange-700 border-2 border-orange-500/50 font-bold'>
              {value}
            </Badge>
          );
        },
      },
      {
        id: 'name',
        accessorKey: 'name',
        size: 200,
        header: ({ column }) => (
          <div className='flex font-bold  items-center gap-1'>
            <span>Subject Name</span>
            <DataTableSorter column={column} />
          </div>
        ),
        cell: ({ getValue }) => {
          const name = getValue<string>();
          return (
            <span className='py-10 text-foreground font-bold'>{name}</span>
          );
        },
        filterFn: 'includesString',
      },
      {
        id: 'department',
        accessorKey: 'department',
        size: 150,
        header: ({ column }) => (
          <div className='flex font-bold  items-center gap-1'>
            <span>Department</span>
            <DataTableSorter column={column} />
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return (
            <Badge
              variant='secondary'
              className='bg-teal-600 text-white text-xs font-bold'
            >
              {value}
            </Badge>
          );
        },
      },
      {
        id: 'description',
        accessorKey: 'description',
        size: 300,
        header: ({ column }) => (
          <div className='flex font-bold  items-center gap-1'>
            <span>Description</span>
            <DataTableSorter column={column} />
          </div>
        ),
        cell: ({ getValue }) => {
          const description = getValue<string>();
          return (
            <span className='text-foreground truncate line-clamp-2'>
              {description}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useTable<Subject>({
    columns,
    refineCoreProps: {
      resource: 'subjects',
      pagination: {
        pageSize: 10,
        mode: 'server',
      },
      filters: {
        permanent: [
          ...(departmentFilter !== 'all'
            ? [
                {
                  field: 'department',
                  operator: 'eq' as const,
                  value: departmentFilter,
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
      sorters: {
        initial: [
          {
            field: 'id',
            order: 'desc',
          },
        ],
      },
    },
  });

  return (
    <ListView className='container mx-auto pb-8 px-2 sm:px-4'>
      <Breadcrumb />
      <div className='space-y-4 mb-6'>
        <h1 className='text-4xl font-bold text-foreground tracking-tight'>
          Subjects
        </h1>
        <div className='flex flex-col gap-5 lg:flex-row justify-between'>
          <p className='mt-2'>
            Quick access to essential metrics and management tools.
          </p>

          <div className='flex flex-col gap-3 sm:flex-row sm:gap-2 w-full sm:w-auto'>
            {/* Search Input */}
            <div className='relative w-full max-h-9 md:max-w-72'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-600' />
              <Input
                type='text'
                placeholder='Search by name...'
                className='pl-10 bg-white w-full'
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>

            {/* Filter and Create Button Row */}
            <div className='flex gap-2 w-full sm:w-auto'>
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className='bg-white text-orange-600 flex-1 sm:flex-initial sm:w-[180px]'>
                  <SelectValue placeholder='Filter by department' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Departments</SelectItem>
                  {DEPARTMENT_OPTIONS.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <CreateButton
                resource='subjects'
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
          onRowClick={(subject) => {
            edit('subjects', subject.id);
          }}
        />
      </Card>
    </ListView>
  );
};
