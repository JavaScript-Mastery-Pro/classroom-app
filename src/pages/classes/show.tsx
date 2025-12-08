import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AdvancedImage } from '@cloudinary/react';
import { ShowView } from '@/components/refine-ui/views/show-view';
import { useResourceParams, useOne } from '@refinedev/core';
import { Calendar, Clock } from 'lucide-react';
import { Class, Subject, User } from '@/types';
import { bannerPhoto } from '@/lib/cloudinary';

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

  // Fetch subject data
  const {
    query: { data: subjectData },
  } = useOne<Subject>({
    resource: 'subjects',
    id: classData?.subjectId,
    queryOptions: {
      enabled: !!classData?.subjectId,
    },
  });

  // Fetch teacher data
  const {
    query: { data: teacherData },
  } = useOne<User>({
    resource: 'users',
    id: classData?.teacherId,
    queryOptions: {
      enabled: !!classData?.teacherId,
    },
  });

  const subject = subjectData?.data;
  const teacher = teacherData?.data;

  // Format time to 12-hour format with AM/PM
  const formatTime12Hour = (time24: string) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

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

  return (
    <ShowView className='container max-w-7xl mx-auto pb-8 px-2 sm:px-4'>
      {/* Banner */}
      {classData.bannerCldPubId && (
        <div className='mt-5 mb-1'>
          <AdvancedImage
            cldImg={bannerPhoto(classData.bannerCldPubId, classData.name)}
            alt='Class Banner'
            className='w-full aspect-[5/1] rounded-xl object-cover border-2 border-gray-100/10 shadow-md'
          />
        </div>
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

          <div className='flex flex-wrap gap-4 text-sm'>
            <div className='flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200'>
              <span className='font-medium text-gray-700'>Class ID:</span>
              <span className='font-mono font-bold text-gray-900'>
                {classData.id}
              </span>
            </div>
            <div className='flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200'>
              <span className='font-medium text-gray-700'>Capacity:</span>
              <span className='font-bold text-gray-900'>
                {classData.capacity} students
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Subject and Teacher Detailed Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-20'>
          {/* Subject Card */}
          <div>
            <div className='flex items-start justify-between mb-3'>
              <p className='text-xs font-bold text-gray-400 uppercase tracking-wider'>
                📚 Subject
              </p>
            </div>

            <div className='space-y-2'>
              <p className='text-xl font-bold text-gray-900'>
                {subject ? subject.name : `Subject ID: ${classData.subjectId}`}
              </p>
              <p className='text-sm font-semibold text-orange-700'>
                {subject ? `Code: ${subject.code}` : 'Code: [Loading...]'}
              </p>
              {subject?.description && (
                <p className='text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed'>
                  {subject.description}
                </p>
              )}
            </div>
          </div>

          {/* Teacher Card */}
          <div>
            <div className='flex items-start justify-between mb-3'>
              <p className='text-xs font-bold text-gray-400 uppercase tracking-wider'>
                👨‍🏫 Instructor
              </p>
            </div>
            <div className='space-y-2'>
              <p className='text-xl font-bold text-gray-900'>
                {teacher ? teacher.name : `Teacher ID: ${classData.teacherId}`}
              </p>
              <p className='text-sm font-semibold text-orange-700'>
                {teacher ? teacher.email : 'Email: [Loading...]'}
              </p>
              {teacher?.department && (
                <p className='text-sm text-gray-600 mt-2'>
                  <span className='font-medium'>Department:</span>{' '}
                  {teacher.department}
                </p>
              )}
            </div>
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
            <p className='text-sm text-gray-700 mb-4'>
              Share this code with students so they can join the class. Students
              can paste this code in the app to enroll.
            </p>
            {/* <div className='flex flex-col  bg-gray-50 border border-gray-200 sm:flex-row items-stretch sm:items-center gap-4'>
              <div className='flex-1 p-5 rounded-lg'>
                <p className='text-xs font-bold text-orange-600 uppercase tracking-wider mb-2'>
                  Class Code
                </p>
                <p className='text-3xl sm:text-4xl font-black text-orange-600 tracking-widest font-mono'>
                  {classData.id}
                </p>
              </div>
              <Button
                onClick={handleCopyCode}
                size='lg'
                className='mr-4 bg-gradient-teal text-white hover:bg-orange-600 h-11 font-bold shadow-md hover:shadow-lg transition-all'
              >
                {copied ? (
                  <>
                    <Check className='h-5 w-5 mr-2' />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className='h-5 w-5 mr-2' />
                    Copy Code
                  </>
                )}
              </Button>
            </div> */}
            <div className='mt-2 p-4 bg-gray-50 border border-gray-200'>
              <p className='text-sm font-bold text-gray-900 mb-2 flex items-center gap-2'>
                📋 Instructions for Students:
              </p>
              <ol className='text-sm text-gray-700 space-y-1.5 list-decimal list-inside ml-2'>
                <li>Copy the class code above</li>
                <li>
                  Go to the &quot;Join Class&quot; section in your student
                  dashboard
                </li>
                <li>Paste the code and click &quot;Join&quot;</li>
              </ol>
            </div>
          </div>
        </div>
      </Card>
    </ShowView>
  );
};
