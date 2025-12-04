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
import { useState } from 'react';

export const FacultyList = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

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
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
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
                <SelectTrigger className='flex-1 bg-white sm:flex-initial sm:w-[160px] h-11'>
                  <SelectValue placeholder='Filter by role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Roles</SelectItem>
                  <SelectItem value='Teacher'>Teacher</SelectItem>
                  <SelectItem value='Admin'>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-center h-[300px]'>
        <h3 className='text-5xl font-bold text-gray-400/30 tracking-tight'>
          Faculty Table
        </h3>
      </div>
    </ListView>
  );
};
