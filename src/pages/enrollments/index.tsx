import { ListView } from '@/components/refine-ui/views/list-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { InfoIcon, Megaphone } from 'lucide-react';
import { useList } from '@refinedev/core';
import { Class } from '@/types';

import { mockAnnouncements } from '@/constants';
import { JoinClassModal } from '@/components/refine-ui/modals/join-class-modal';
import { useState } from 'react';
import { ClassCard } from '@/components/refine-ui/layout/class-card';

export const EnrollmentList = () => {
  const [open, setOpen] = useState(false);
  const [classId, setClassId] = useState<number | null>(null);

  // Fetch all classes
  const { query: classesQuery } = useList<Class>({
    resource: 'classes',
    pagination: {
      pageSize: 100,
    },
  });

  const allClasses = classesQuery.data?.data || [];
  const activeClasses = allClasses.filter((c) => c.status === 'active');

  const onClickHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setClassId(classId);
    setOpen(true);
  };

  return (
    <ListView className='container mx-auto pb-8 px-2 sm:px-4'>
      <div className='mb-4'>
        <h1 className='text-4xl font-bold text-foreground tracking-tight'>
          Join Classes
        </h1>
        <p className='mt-2'>
          Browse available classes and join using the class code provided by
          your teacher
        </p>
      </div>

      {/* Announcements Section */}
      <Card className='border-2 border-teal-600/30 bg-gradient-to-br from-teal-50 to-teal-100 shadow-md transition-shadow duration-300 mb-5 relative overflow-hidden'>
        {/* Decorative corner accent */}
        <div className='absolute top-0 right-0 w-32 h-32 bg-teal-600/10 rounded-bl-full' />
        <div className='absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-tr-full' />

        <CardHeader className='relative z-10'>
          <div className='flex items-center space-x-3'>
            <div className='bg-gradient-teal p-3 rounded-lg shadow-md'>
              <Megaphone className='h-6 w-6 text-white' />
            </div>
            <div>
              <CardTitle className='text-xl font-bold text-gradient-teal'>
                Important Announcements
              </CardTitle>
              <p className='text-sm'>Stay updated with latest information</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-3 relative z-10'>
          {mockAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className='bg-white border-l-4 border-teal-600 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:translate-x-1'
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
                  <div className='bg-gradient-teal-light p-2 rounded-lg'>
                    <InfoIcon className='h-6 w-6 text-teal-600' />
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {classesQuery.isLoading ? (
        <div className='flex items-center justify-center h-64'>
          <p className='text-muted-foreground'>Loading classes...</p>
        </div>
      ) : activeClasses.length === 0 ? (
        <div className='flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200'>
          <p className='text-2xl font-bold text-gray-400 mb-2'>
            No Active Classes
          </p>
          <p className='text-sm text-gray-500'>
            There are currently no active classes available to join.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 2xl:gap-7'>
          {activeClasses.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              onClickHandler={onClickHandler}
            />
          ))}
        </div>
      )}

      {classId && (
        <JoinClassModal classId={classId} open={open} onOpenChange={setOpen} />
      )}
    </ListView>
  );
};
