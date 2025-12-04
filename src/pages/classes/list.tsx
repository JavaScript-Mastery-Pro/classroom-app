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

export const ClassesList = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  const handleSearch = (value: string) => {
    setGlobalFilter(value);
  };

  const handleSubjectFilter = (value: string) => {
    setSubjectFilter(value);
  };

  const subjects = [
    { id: 1, code: 'MATH101', name: 'Calculus I' },
    { id: 2, code: 'PHY101', name: 'Physics I' },
    { id: 3, code: 'CHEM101', name: 'Chemistry I' },
    // Add more subjects as needed
  ];

  return (
    <ListView className='container mx-auto pb-8 px-2 sm:px-4'>
      <Breadcrumb />
      <div className='space-y-4 mb-6'>
        <h1 className='text-4xl font-bold text-foreground tracking-tight'>
          Classes
        </h1>
        <div className='flex flex-col gap-5 lg:flex-row justify-between'>
          <p className='mt-2'>
            Quick access to essential metrics and management tools.
          </p>

          <div className='flex flex-col gap-3 sm:flex-row sm:gap-2 w-full sm:w-auto'>
            {/* Search Input */}
            <div className='relative max-h-9 w-full md:max-w-72'>
              <Search className='absolute left-3 text-orange-600 top-1/2 -translate-y-1/2 h-4 w-4' />
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
              <Select value={subjectFilter} onValueChange={handleSubjectFilter}>
                <SelectTrigger className='flex-1 bg-white text-orange-600 sm:flex-initial sm:w-[180px] h-11'>
                  <SelectValue placeholder='Filter by subject' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.code} - {subject.name}
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
      <div className='flex items-center justify-center h-[300px]'>
        <h3 className='text-5xl font-bold text-gray-400/30 tracking-tight'>
          Class Table
        </h3>
      </div>
    </ListView>
  );
};
