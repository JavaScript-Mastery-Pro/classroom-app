import { ListView } from '@/components/refine-ui/views/list-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { InfoIcon, Megaphone, Clock, Users, BookOpen } from 'lucide-react';
import { useList, useNavigation } from '@refinedev/core';
import { Class } from '@/types';

import { formatTime12Hour } from '@/lib/utils';
import { mockAnnouncements } from '@/constants';

// import { JoinClassModal } from '@/components/refine-ui/modals/join-class-modal';

export const JoinClassesList = () => {
  const { show } = useNavigation();

  // Fetch all classes
  const { query: classesQuery } = useList<Class>({
    resource: 'classes',
    pagination: {
      pageSize: 100,
    },
  });

  const allClasses = classesQuery.data?.data || [];
  const activeClasses = allClasses.filter((c) => c.status === 'active');

  const ClassCard = ({ classItem }: { classItem: Class }) => (
    <Card
      onClick={() => show('classes', classItem.id)}
      className='pt-0 cursor-pointer group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:-translate-y-1 bg-white'
    >
      {/* Banner Image with Overlay */}
      <div className='relative h-28 overflow-hidden bg-gradient-to-br from-orange-100 to-teal-100'>
        <img
          src={classItem.bannerUrl}
          alt='Class Banner'
          className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent' />

        {/* Class Name Overlay */}
        <div className='absolute bottom-0 left-0 right-0 px-4 py-10 bg-gradient-to-t from-black/40 to-transparent'>
          <span className='text-base font-bold text-white/90 line-clamp-1'>
            {classItem?.subject?.department}
          </span>
        </div>

        {/* Status Badge */}
        <div className='absolute top-3 right-3'>
          <Badge
            className={
              classItem.status === 'active'
                ? 'bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 font-bold shadow-lg border border-white/50'
                : 'bg-gray-600 text-white px-3 py-1.5 font-bold shadow-lg border border-white/50'
            }
          >
            {classItem.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <CardContent className='px-6 h-full flex flex-col'>
        <div className='space-y-2'>
          <p className='text-sm font-semibold text-orange-600'>
            {classItem?.subject?.code}
          </p>
          <h3 className='text-xl font-bold mb-1 truncate'>{classItem.name}</h3>
          <div className='mb-4 text-sm text-gray-700 leading-relaxed line-clamp-2'>
            {classItem.description}
          </div>
        </div>

        {/* Class Details */}
        <div className='space-y-2 flex-1'>
          {/* Subject */}
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center w-10 h-10 bg-orange-50 rounded-lg'>
              <BookOpen className='h-4 w-4 text-orange-600' />
            </div>
            <div className='flex-1'>
              <p className='text-xs font-medium text-gray-500 mb-0.5'>
                Subject
              </p>
              <p className='text-sm font-bold text-gray-900'>
                {classItem?.subject?.name}
              </p>
            </div>
          </div>

          {/* Teacher */}
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center w-10 h-10 bg-orange-50 rounded-lg'>
              <Users className='h-4 w-4 text-orange-600' />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-xs font-medium text-gray-500 mb-0.5'>
                Instructor
              </p>
              <p className='text-sm font-bold text-gray-900 truncate'>
                {classItem?.teacher?.name}
              </p>
            </div>
          </div>

          {/* Schedule Preview */}
          <div className='pt-2'>
            <div className='flex gap-3 items-start'>
              {/* Icon */}
              <div className='flex items-center justify-center w-10 h-10 bg-orange-50 rounded-lg'>
                <Clock className='h-4 w-4 text-orange-600' />
              </div>

              {/* Schedule List */}
              <ul className='space-y-1'>
                <p className='text-xs font-medium text-gray-500'>Schedule</p>
                {classItem?.schedules?.slice(0, 2).map((schedule, idx) => (
                  <li
                    key={idx}
                    className='text-sm text-gray-400 flex items-center gap-1.5'
                  >
                    <span className='font-bold text-gray-900'>
                      {schedule.day}
                    </span>
                    •
                    <span className='text-gray-600 font-medium'>
                      {formatTime12Hour(schedule.startTime)} –{' '}
                      {formatTime12Hour(schedule.endTime)}
                    </span>
                  </li>
                ))}

                {/* More sessions */}
                {(classItem?.schedules?.length ?? 0) > 2 && (
                  <p className='text-xs font-medium text-gray-500'>
                    +{(classItem?.schedules?.length ?? 0) - 2} more schedule
                    {(classItem?.schedules?.length ?? 0) - 2 > 1 ? 's' : ''}
                  </p>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-end gap-3'>
          <Button
            size='lg'
            // onClick={() => setJoinModalOpen(true)}
            className='w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 font-semibold shadow-md hover:shadow-lg transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500'
          >
            Join Class
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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
            <ClassCard key={classItem.id} classItem={classItem} />
          ))}
        </div>
      )}
    </ListView>
  );
};
