import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { ClassSchedule } from '@/types';

type ScheduleInputProps = {
  schedules: ClassSchedule[];
  onChange: (schedules: ClassSchedule[]) => void;
};

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const ScheduleInput = ({ schedules, onChange }: ScheduleInputProps) => {
  const [newSchedule, setNewSchedule] = useState<ClassSchedule>({
    day: '',
    startTime: '',
    endTime: '',
  });

  const handleAddSchedule = () => {
    if (newSchedule.day && newSchedule.startTime && newSchedule.endTime) {
      onChange([...schedules, newSchedule]);
      setNewSchedule({ day: '', startTime: '', endTime: '' });
    }
  };

  const handleRemoveSchedule = (index: number) => {
    const updatedSchedules = schedules.filter((_, i) => i !== index);
    onChange(updatedSchedules);
  };

  // Convert 24-hour time to 12-hour format with AM/PM
  const formatTime12Hour = (time24: string) => {
    if (!time24) return '';

    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;

    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label className='mb-5 text-gray-900 font-semibold text-xl'>
          Class Schedule ({schedules.length})
        </Label>
        <div className='flex flex-col sm:flex-row gap-4 sm:items-end'>
          <div className='flex w-full flex-col gap-2'>
            <Label className='text-gray-900 font-semibold'>Day</Label>
            <Select
              value={newSchedule.day}
              onValueChange={(value) =>
                setNewSchedule({ ...newSchedule, day: value })
              }
            >
              <SelectTrigger className='w-full bg-gray-0 !h-10 border-2 border-gray-200'>
                <SelectValue placeholder='Select day' />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex justify-start gap-4'>
            <div className='space-y-2 '>
              <Label className='text-gray-900 font-semibold'>Start Time</Label>
              <Input
                type='time'
                value={newSchedule.startTime}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, startTime: e.target.value })
                }
                className='bg-gray-0 w-fit h-10 border-2 border-gray-200'
              />
            </div>

            <div className='space-y-2 '>
              <Label className='text-gray-900 font-semibold'>End Time</Label>
              <Input
                type='time'
                value={newSchedule.endTime}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, endTime: e.target.value })
                }
                className='bg-gray-0 w-fit h-10 border-2 border-gray-200'
              />
            </div>
          </div>

          <Button
            type='button'
            onClick={handleAddSchedule}
            className='h-10 lg:min-w-32 cursor-pointer'
          >
            <Plus className='w-4 h-4 mr-1' />
            Add
          </Button>
        </div>
      </div>

      {schedules.length > 0 && (
        <div className='space-y-2'>
          {schedules.map((schedule, index) => (
            <div
              key={index}
              className='flex items-center justify-between p-3 bg-teal-50 border border-gray-200 rounded-md'
            >
              <div className='flex items-center text-gray-700 gap-4 text-sm'>
                <span className='font-bold min-w-[100px]'>{schedule.day}</span>
                <span className='font-bold'>
                  {formatTime12Hour(schedule.startTime)} -{' '}
                  {formatTime12Hour(schedule.endTime)}
                </span>
              </div>

              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => handleRemoveSchedule(index)}
                className='text-red-500 cursor-pointer hover:bg-red-100 hover:text-red-700'
              >
                <Trash2 className='w-4 h-4' />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
