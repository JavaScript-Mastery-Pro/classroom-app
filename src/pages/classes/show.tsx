import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AdvancedImage } from '@cloudinary/react';
import { ShowView } from '@/components/refine-ui/views/show-view';
import { useResourceParams, useOne } from '@refinedev/core';
import { Calendar, Clock } from 'lucide-react';
import { Class } from '@/types';
import { bannerPhoto } from '@/lib/cloudinary';
import { formatTime12Hour } from '@/lib/utils';

export const ClassesShow = () => {
  const { id } = useResourceParams();

  // Fetch class data
  const {
    query: { data: classQueryData, isLoading: isClassLoading },
  } = useOne<Class>({
    resource: 'classes',
    id: id as string,
  });

  const classData = classQueryData?.data;

  if (isClassLoading) {
    return (
      <ShowView className='container mx-auto pb-8 px-2 sm:px-4'>
        <div className='flex items-center justify-center h-96'>
          <p className='text-muted-foreground'>Loading class details...</p>
        </div>
      </ShowView>
    );
  }

  if (!classData) {
    return (
      <ShowView className='container mx-auto pb-8 px-2 sm:px-4'>
        <div className='flex items-center justify-center h-96'>
          <p className='text-muted-foreground'>Class not found</p>
        </div>
      </ShowView>
    );
  }

  console.log('classData frontend', classData);

  return (
    <ShowView className='container max-w-7xl mx-auto pb-8 px-2 sm:px-4'>
      {/* Banner */}
      {classData.bannerCldPubId && (
        <AdvancedImage
          cldImg={bannerPhoto(classData.bannerCldPubId, classData.name)}
          alt='Class Banner'
          className='w-full mt-5 mb-1 aspect-[5/1] rounded-xl object-cover border-2 border-gray-100/10 shadow-md'
        />
      )}

      <Card className='p-6 sm:p-8 space-y-3 shadow-md'>
        {/* Class Details */}
        <div>
          <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4'>
            <div className='flex-1 space-y-2'>
              <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>
                {classData.name}
              </h1>
              <p className='text-sm text-gray-600'>{classData.description}</p>
            </div>
            <Badge
              variant={classData.status === 'active' ? 'default' : 'secondary'}
              className={
                classData.status === 'active'
                  ? 'bg-green-600 text-white hover:bg-green-700 px-3 py-1'
                  : 'bg-gray-600 text-white px-3 py-1'
              }
            >
              {classData.status.toUpperCase()}
            </Badge>
          </div>

          <div className='grid sm:grid-cols-2 mt-8 gap-4 text-sm'>
            <div className='space-y-2'>
              <p className='text-xs mb-3 font-bold text-gray-400 uppercase tracking-wider'>
                👨‍🏫 Instructor
              </p>
              <p className='text-sm flex gap-2 items-center font-bold text-gray-900'>
                <span className='font-mono font-bold text-orange-700'>
                  Teacher: {classData.teacher?.name}
                </span>
              </p>
              <p className='text-sm font-medium '>
                Email: {classData?.teacher?.email}
              </p>
            </div>
            <div className='space-y-2'>
              <p className='text-xs mb-3 font-bold text-gray-400 uppercase tracking-wider'>
                🏛️ Department
              </p>
              <p className='text-sm flex gap-2 items-center font-bold text-orange-700'>
                {classData?.teacher?.department}
              </p>
              <p className='text-sm font-medium '>
                Capacity: {classData.capacity} students
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Subject Card */}
        <div>
          <div className='flex items-start justify-between mb-3'>
            <p className='text-xs font-bold text-gray-400 uppercase tracking-wider'>
              📚 Course
            </p>
          </div>

          <div className='space-y-2'>
            <p className='text-sm font-semibold text-orange-700'>
              Code: {classData?.subject?.code}
            </p>
            <p className='text-2xl font-bold text-gray-900'>
              {classData?.subject?.name}
            </p>

            <p className='text-sm text-gray-600 mt-2 leading-relaxed'>
              {classData?.subject?.description}
            </p>
          </div>
        </div>

        {/* Schedule Section */}
        {classData.schedules && classData.schedules.length > 0 && (
          <>
            <Separator />
            <div>
              <h2 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <div className='w-1 h-5 bg-orange-500 rounded'></div>
                <Calendar className='h-5 w-5 text-orange-500' />
                Class Schedule
              </h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {classData.schedules.map((slot, index: number) => (
                  <div
                    key={index}
                    className='flex items-center gap-4 p-4 bg-teal-50/40 border border-teal-100 transition-all'
                  >
                    <div className='flex items-center justify-center w-12 h-12 bg-teal-600 rounded-lg shrink-0'>
                      <Clock className='h-6 w-6 text-white' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-bold text-gray-900 text-lg'>
                        {slot.day}
                      </p>
                      <p className='text-sm font-semibold text-teal-700'>
                        {formatTime12Hour(slot.startTime)} -{' '}
                        {formatTime12Hour(slot.endTime)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Join This Class Section */}
        <div>
          <h2 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
            <div className='w-1 h-5 bg-orange-500 rounded'></div>
            🎓 Join This Class
          </h2>
          <div>
            <div className='mt-2 p-4 bg-gray-50 border border-gray-200'>
              <p className='text-sm font-bold text-gray-900 mb-2 flex items-center gap-2'>
                📋 Instructions for Students:
              </p>
              <ol className='text-sm text-gray-700 space-y-1.5 list-decimal list-inside ml-2'>
                <li>Ask your teacher for the invite code.</li>
                <li>Click on &quot;Join Class&quot; button.</li>
                <li>Paste the code and click &quot;Join&quot;</li>
              </ol>
            </div>
          </div>
        </div>
      </Card>
    </ShowView>
  );
};
