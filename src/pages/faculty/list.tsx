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
import { DataTableSorter } from '@/components/refine-ui/data-table/data-table-sorter';
import { cn } from '@/lib/utils';
import { AdvancedImage } from '@cloudinary/react';
import { profilePhoto } from '@/lib/cloudinary';
import { ShowButton } from '@/components/refine-ui/buttons/show';

export const FacultyList = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'imageCldPubId',
        accessorKey: 'imageCldPubId',
        size: 80,
        header: ({ column }) => (
          <div className='flex ml-2 items-center gap-1'>
            <span>Profile</span>
            <DataTableSorter column={column} />
          </div>
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
        header: ({ column }) => (
          <div className='flex items-center gap-1'>
            <span>Name</span>
            <DataTableSorter column={column} />
          </div>
        ),
        cell: ({ getValue }) => {
          const name = getValue<string>();
          return (
            <span className='capitalize text-foreground font-bold text-sm'>
              {name}
            </span>
          );
        },
        filterFn: 'includesString',
      },
      {
        id: 'email',
        accessorKey: 'email',
        size: 250,
        header: ({ column }) => (
          <div className='flex items-center gap-1'>
            <span>Email</span>
            <DataTableSorter column={column} />
          </div>
        ),
        cell: ({ getValue }) => {
          const email = getValue<string>();
          return <span className='text-foreground font-medium'>{email}</span>;
        },
        filterFn: 'includesString',
      },
      {
        id: 'role',
        accessorKey: 'role',
        size: 120,
        header: ({ column }) => (
          <div className='flex items-center gap-1'>
            <span>Role</span>
            <DataTableSorter column={column} />
          </div>
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
                  : 'bg-teal-500 text-white'
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
        header: ({ column }) => (
          <div className='flex items-center gap-1'>
            <span>Department</span>
            <DataTableSorter column={column} />
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return (
            <span className='text-foreground font-medium'>
              {value || 'N/A'}
            </span>
          );
        },
      },
      {
        id: 'actions',
        size: 100,
        header: 'Actions',
        cell: ({ row }) => (
          <div
            className='flex items-center gap-2'
            onClick={(e) => e.stopPropagation()}
          >
            <ShowButton
              resource='users'
              recordItemId={row.original.id}
              size='sm'
              variant='outline'
            >
              View
            </ShowButton>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  const table = useTable<User>({
    columns,
    refineCoreProps: {
      resource: 'users',
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

  const handleSearch = (value: string) => {
    setGlobalFilter(value);
  };

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value);
  };

  return (
    <ListView className='container mx-auto pb-8 px-2 sm:px-4'>
      <Breadcrumb />
      <div className='mb-8'>
        <h1 className='text-4xl font-bold text-foreground tracking-tight'>
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
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Filter Row */}
            <div className='flex gap-2 w-full sm:w-auto'>
              <Select value={roleFilter} onValueChange={handleRoleFilter}>
                <SelectTrigger className='flex-1 text-orange-700 bg-white sm:flex-initial sm:w-[160px] h-11'>
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

      <div className='w-full relative'>
        <div className='absolute -top-1.5 rounded-t-md left-0 right-0 h-2 bg-gradient-orange' />
        <DataTable table={table} />
      </div>
    </ListView>
  );
};
