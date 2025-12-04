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
import { CreateButton } from '@/components/refine-ui/buttons/create';

export const SubjectsList = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const handleSearch = (value: string) => {
    setGlobalFilter(value);
  };

  const handleDepartmentFilter = (value: string) => {
    setDepartmentFilter(value);
  };

  return (
    <ListView className='container mx-auto pb-8 px-2 sm:px-4'>
      <Breadcrumb />
      <div className='mb-8'>
        <h1 className='text-4xl font-bold text-foreground tracking-tight'>
          Subjects
        </h1>
        <div className='flex justify-between  '>
          <p className='mt-2'>
            Quick access to essential metrics and management tools.
          </p>

          <div className='flex flex-col gap-3 sm:flex-row sm:gap-2 w-full sm:w-auto'>
            {/* Search Input */}
            <div className='relative w-full md:max-w-72'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                type='text'
                placeholder='Search by name...'
                className='pl-10 bg-white w-full'
                value={globalFilter}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Filter and Create Button Row */}
            <div className='flex gap-2 w-full sm:w-auto'>
              <Select
                value={departmentFilter}
                onValueChange={handleDepartmentFilter}
              >
                <SelectTrigger className='bg-white flex-1 sm:flex-initial sm:w-[180px]'>
                  <SelectValue placeholder='Filter by department' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Departments</SelectItem>
                  <SelectItem value='Computer Science'>
                    Computer Science
                  </SelectItem>
                  <SelectItem value='Mathematics'>Mathematics</SelectItem>
                  <SelectItem value='Physics'>Physics</SelectItem>
                  <SelectItem value='Chemistry'>Chemistry</SelectItem>
                  <SelectItem value='Biology'>Biology</SelectItem>
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

      <div className='flex items-center justify-center h-[300px]'>
        <h3 className='text-5xl font-bold text-gray-400/30 tracking-tight'>
          Subjects Table
        </h3>
      </div>
    </ListView>
  );
};
