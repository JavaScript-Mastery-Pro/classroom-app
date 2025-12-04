import { ListView } from '@/components/refine-ui/views/list-view';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';

export const FacultyList = () => {
  return (
    <ListView className='container mx-auto pb-8 px-2 sm:px-4'>
      <Breadcrumb />
      <div className='mb-8'>
        <h1 className='text-4xl font-bold text-foreground tracking-tight'>
          Faculty
        </h1>
        <p className='mt-2'>
          Quick access to essential metrics and management tools.
        </p>
      </div>
      <div className='flex items-center justify-center h-[300px]'>
        <h3 className='text-5xl font-bold text-gray-400/30 tracking-tight'>
          Faculty Table
        </h3>
      </div>
    </ListView>
  );
};
