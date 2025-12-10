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
import { Badge } from '@/components/ui/badge';
import { useMemo, useState } from 'react';
import { User } from '@/types';
import { useTable } from '@refinedev/react-table';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { cn } from '@/lib/utils';
import { AdvancedImage } from '@cloudinary/react';
import { profilePhoto } from '@/lib/cloudinary';
import { useNavigation } from '@refinedev/core';

export const UsersList = () => {
  const { edit } = useNavigation();
  const [globalFilter, setGlobalFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'imageCldPubId',
        accessorKey: 'imageCldPubId',
        size: 80,
        header: () => (
          <div className='flex font-bold ml-2 items-center gap-1'>Profile</div>
        ),
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return (
            <AdvancedImage
              className='ml-2 w-10 my-1 h-10 rounded-full border-2 border-orange-500'
              cldImg={profilePhoto(value)}
              alt={value}
            />
          );
        },
      },
      {
        id: 'name',
        accessorKey: 'name',
        size: 200,
        header: () => (
          <div className='flex font-bold items-center gap-1'>Name</div>
        ),
        cell: ({ getValue }) => {
          const name = getValue<string>();
          return (
            <div className='capitalize text-foreground font-bold text-sm'>
              {name}
            </div>
          );
        },
      },
      {
        id: 'email',
        accessorKey: 'email',
        size: 250,
        header: () => (
          <div className='flex font-bold items-center gap-1'>Email</div>
        ),
        cell: ({ getValue }) => {
          const email = getValue<string>();
          return <span className='text-foreground font-medium'>{email}</span>;
        },
      },
      {
        id: 'role',
        accessorKey: 'role',
        size: 120,
        header: () => (
          <div className='flex font-bold items-center gap-1'>Role</div>
        ),
        cell: ({ getValue }) => {
          const role = getValue<string>();
          return (
            <Badge
              variant={role === 'admin' ? 'default' : 'secondary'}
              className={cn(
                'capitalize p-1 px-2 font-bold text-xs',
                role === 'admin'
                  ? 'bg-orange-600 text-white border-0'
                  : 'bg-teal-600 text-white'
              )}
            >
              {role}
            </Badge>
          );
        },
      },
      {
        id: 'department',
        accessorKey: 'department',
        size: 180,
        header: () => (
          <div className='flex font-bold items-center gap-1'>Department</div>
        ),
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return <span className='text-foreground font-medium'>{value}</span>;
        },
      },
    ],
    []
  );

  const table = useTable<User>({
    columns,
    refineCoreProps: {
      resource: 'users',
      pagination: {
        pageSize: 10,
        mode: 'server', // Added server-side pagination
      },
      filters: {
        permanent: [
          // Always filter for teachers and admins, unless a specific role is selected
          {
            field: 'role',
            operator: 'eq' as const,
            value: roleFilter === 'all' ? 'teacher,admin' : roleFilter,
          },
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
        <h1 className='text-3xl font-bold text-foreground tracking-tight'>
          Faculty
        </h1>

        <div className='flex flex-col gap-5 lg:flex-row justify-between'>
          <p className='mt-2'>
            Quick access to essential metrics and management tools.
          </p>

          <div className='flex flex-col gap-3 sm:flex-row sm:gap-2 w-full sm:w-auto'>
            {/* Search Input */}
            <div className='relative max-h-9 w-full md:max-w-72'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-600' />
              <Input
                type='text'
                placeholder='Search by name...'
                className='pl-10 bg-white w-full'
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>

            {/* Filter Row */}
            <div className='flex gap-2 w-full sm:w-auto'>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className='flex-1 text-orange-600 bg-white sm:flex-initial sm:w-[160px] h-11'>
                  <SelectValue placeholder='Filter by role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Roles</SelectItem>
                  <SelectItem value='teacher'>Teacher</SelectItem>
                  <SelectItem value='admin'>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        table={table}
        onRowClick={(user) => {
          edit('users', user.id);
        }}
      />
    </ListView>
  );
};
