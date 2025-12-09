import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatTime12Hour } from '@/lib/utils';
import { Clock, Users, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Class } from '@/types';
import { useNavigation } from '@refinedev/core';

export const ClassCard = ({
  classItem,
  onClickHandler,
}: {
  classItem: Class;
  onClickHandler?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
  const { show } = useNavigation();

  return (
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
        {onClickHandler && (
          <div className='flex items-end gap-3'>
            <Button
              size='lg'
              onClick={(e) => onClickHandler(e)}
              disabled={
                (classItem?.students?.length ?? 0) >= (classItem.capacity || 0)
              }
              className='w-full mt-4 cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 font-semibold shadow-md hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-600 disabled:text-gray-500'
            >
              Join Class {classItem?.students?.length}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
