import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { InfoIcon, Megaphone } from 'lucide-react';
import { useList } from '@refinedev/core';
import { Class } from '@/types';

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
    <div className='container mx-auto pb-6 px-2 sm:px-4'>
      <div className='mb-5'>
        <h1 className='text-3xl font-semibold text-gray-900'> Join Classes</h1>
        <p className='mt-2 text-gray-700'>
          Browse available classes and join using the class code provided by
          your teacher
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
          <div className='bg-white border-l-4 border-orange-600 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:translate-x-1'>
            <div className='flex items-start justify-between gap-3'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <h3 className='font-bold text-gray-700 text-base'>
                    How to join a class
                  </h3>
                  <span className='bg-gradient-orange text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm'>
                    High Priority
                  </span>
                </div>
                <p className='text-sm text-gray-900 leading-relaxed mb-2'>
                  Click on any class card to view details, then click the "Join
                  Class" button and enter the class code. You can also join
                  directly from the card by clicking the join button.
                </p>
              </div>
              <div className='bg-gradient-orange-light p-2 rounded-lg'>
                <InfoIcon className='h-6 w-6 text-orange-600' />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class List */}
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

      {/* Join Modal */}
      {classId && (
        <JoinClassModal classId={classId} open={open} onOpenChange={setOpen} />
      )}
    </div>
  );
};
