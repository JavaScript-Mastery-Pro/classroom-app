import { useState } from 'react';
import { ListView } from '@/components/refine-ui/views/list-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfoIcon, Megaphone, Clock, Users, BookOpen } from 'lucide-react';
import { useList, useNavigation } from '@refinedev/core';
import { Class } from '@/types';
import { AdvancedImage } from '@cloudinary/react';
import { bannerPhoto } from '@/lib/cloudinary';
// import { JoinClassModal } from '@/components/refine-ui/modals/join-class-modal';

export const JoinClassesList = () => {
  const { show } = useNavigation();
  const [activeTab, setActiveTab] = useState('active');
  // const [joinModalOpen, setJoinModalOpen] = useState(false);

  const mockAnnouncements = [
    {
      id: 1,
      title: 'How to join a class',
      message:
        'Click on any class card to view details, then click the "Join Class" button and enter the class code. You can also join directly from the card by clicking the join button.',
      priority: 'high',
      date: '2026-01-15',
    },
  ];

  // Fetch all classes
  const { query: classesQuery } = useList<Class>({
    resource: 'classes',
    pagination: {
      pageSize: 100,
    },
  });

  const allClasses = classesQuery.data?.data || [];
  const activeClasses = allClasses.filter((c) => c.status === 'active');
  const inactiveClasses = allClasses.filter((c) => c.status === 'inactive');

  // Format time to 12-hour format with AM/PM
  const formatTime12Hour = (time24: string) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const ClassCard = ({ classItem }: { classItem: Class }) => (
    <Card
      onClick={() => show('classes', classItem.id)}
      className='pt-0 cursor-pointer group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:-translate-y-1 bg-white'
    >
      {/* Banner Image with Overlay */}
      <div className='relative h-20 overflow-hidden bg-gradient-to-br from-orange-100 to-teal-100'>
        {classItem.bannerCldPubId ? (
          <>
            <AdvancedImage
              cldImg={bannerPhoto(classItem.bannerCldPubId, classItem.name)}
              alt='Class Banner'
              className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
            />
            {/* Dark overlay for better badge visibility */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />
          </>
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-200 to-teal-200'>
            <BookOpen className='h-16 w-16 text-white/50' />
          </div>
        )}

        {/* Status Badge */}
        <div className='absolute top-3 right-3'>
          <Badge
            className={
              classItem.status === 'active'
                ? 'bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 font-bold shadow-lg border border-white'
                : 'bg-gray-600 text-white px-3 py-1.5 font-bold shadow-lg border border-white'
            }
          >
            {classItem.status.toUpperCase()}
          </Badge>
        </div>

        {/* Class Name Overlay */}
        <div className='absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent'>
          {classItem.subject && (
            <div className='flex items-center gap-2'>
              <div className='h-1 w-1 bg-orange-400 rounded-full' />
              <span className='text-sm font-semibold text-orange-300'>
                {classItem.subject.code}
              </span>
              <div className='h-1 w-1 bg-orange-400 rounded-full' />
              <span className='text-sm font-medium text-white/90 line-clamp-1'>
                {classItem.subject.name}
              </span>
            </div>
          )}
        </div>
      </div>

      <CardContent className='px-6 space-y-5'>
        <h3 className='text-xl font-bold mb-1 line-clamp-1'>
          {classItem.name}
        </h3>
        {/* Description */}
        {classItem.description && (
          <div className='pb-4 border-b border-gray-100'>
            <p className='text-sm text-gray-700 leading-relaxed line-clamp-1'>
              {classItem.description}
            </p>
          </div>
        )}

        {/* Class Details */}
        <div className='space-y-3.5'>
          {/* Teacher */}
          {classItem.teacher && (
            <div className='flex items-center gap-3'>
              <div className='flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg'>
                <Users className='h-5 w-5 text-gray-600' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-xs font-medium text-gray-500 mb-0.5'>
                  Instructor
                </p>
                <p className='text-sm font-bold text-gray-900 truncate'>
                  {classItem.teacher.name}
                </p>
              </div>
            </div>
          )}

          {/* Capacity */}
          {classItem.capacity && (
            <div className='flex items-center gap-3'>
              <div className='flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg'>
                <Users className='h-5 w-5 text-gray-600' />
              </div>
              <div className='flex-1'>
                <p className='text-xs font-medium text-gray-500 mb-0.5'>
                  Class Capacity
                </p>
                <p className='text-sm font-bold text-gray-900'>
                  {classItem.capacity} Students
                </p>
              </div>
            </div>
          )}

          {/* Schedule Preview */}
          {classItem.schedules && classItem.schedules.length > 0 && (
            <div className='pt-2'>
              <div className='space-y-2'>
                {classItem.schedules.slice(0, 2).map((schedule, idx) => (
                  <div key={idx} className='flex items-center gap-2.5 text-sm'>
                    <div className='flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg'>
                      <Clock className='h-5 w-5 text-gray-600 flex-shrink-0' />
                    </div>

                    <span className='font-bold text-gray-900'>
                      {schedule.day}
                    </span>
                    <span className='text-gray-600 font-medium'>
                      {formatTime12Hour(schedule.startTime)} -{' '}
                      {formatTime12Hour(schedule.endTime)}
                    </span>
                  </div>
                ))}
                {classItem.schedules.length > 2 && (
                  <p className='text-xs font-medium text-gray-500 flex items-center gap-1.5'>
                    <Clock className='h-4 w-4' />+
                    {classItem.schedules.length - 2} more session
                    {classItem.schedules.length - 2 > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3'>
          <Button
            size='lg'
            // onClick={() => setJoinModalOpen(true)}
            className='flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 font-semibold shadow-md hover:shadow-lg transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500'
            disabled={classItem.status === 'inactive'}
          >
            {classItem.status === 'active' ? 'Join Class' : 'Unavailable'}
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
      <Card className='border-2 border-teal-600/30 bg-gradient-to-br from-teal-50 to-teal-100 shadow-md transition-shadow duration-300 mb-10 relative overflow-hidden'>
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

      {/* Classes Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full mx-auto grid-cols-2 h-12 bg-gray-200/50 border border-gray-200'>
          <TabsTrigger
            value='active'
            className='text-base font-semibold data-[state=active]:bg-green-600 data-[state=active]:text-white'
          >
            Active Classes ({activeClasses.length})
          </TabsTrigger>
          <TabsTrigger
            value='inactive'
            className='text-base font-semibold data-[state=active]:bg-gray-600 data-[state=active]:text-white'
          >
            Inactive Classes ({inactiveClasses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value='active' className='mt-4'>
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
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
              {activeClasses.map((classItem) => (
                <ClassCard key={classItem.id} classItem={classItem} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='inactive' className='mt-4'>
          {classesQuery.isLoading ? (
            <div className='flex items-center justify-center h-64'>
              <p className='text-muted-foreground'>Loading classes...</p>
            </div>
          ) : inactiveClasses.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200'>
              <p className='text-2xl font-bold text-gray-400 mb-2'>
                No Inactive Classes
              </p>
              <p className='text-sm text-gray-500'>
                There are currently no inactive classes.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
              {inactiveClasses.map((classItem) => (
                <ClassCard key={classItem.id} classItem={classItem} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Join Class Modal */}
      {/* <JoinClassModal open={joinModalOpen} onOpenChange={setJoinModalOpen} /> */}
    </ListView>
  );
};
