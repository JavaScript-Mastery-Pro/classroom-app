import { useForm } from '@refinedev/react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdvancedImage } from '@cloudinary/react';
import { EditView } from '@/components/refine-ui/views/edit-view';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { FileUploader } from '@/components/refine-ui/form/file-uploader';
import { ScheduleInput } from '@/components/refine-ui/form/schedule-input';

import { Textarea } from '@/components/ui/textarea';
import {
  useBack,
  useInvalidate,
  useNavigation,
  useResourceParams,
  useDelete,
  useList,
} from '@refinedev/core';
import { Loader2, Copy, RefreshCw, Check } from 'lucide-react';
import { Class, ClassSchedule, Subject, User } from '@/types';
import { classSchema } from '@/lib/schema';
import { ConfirmationModal } from '@/components/refine-ui/modals/confirmation-modal';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_UPLOAD_URL } from '@/constants';
import { bannerPhoto } from '@/lib/cloudinary';
import { generateInviteCode } from '@/lib/utils/classCode';

export const ClassesEdit = () => {
  const { id } = useResourceParams();
  const { list, show } = useNavigation();
  const invalidate = useInvalidate();
  const back = useBack();
  const [banner, setBanner] = useState<File[]>([]);
  const [updateBanner, setUpdateBanner] = useState(false);
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const form = useForm({
    resolver: zodResolver(classSchema),
    refineCoreProps: {
      resource: 'classes',
      action: 'edit',
      id: id,
      redirect: false,
    },
    defaultValues: {
      name: '',
      subjectId: 0,
      teacherId: '',
      capacity: 0,
      description: '',
      status: 'active',
      bannerUrl: '',
      bannerCldPubId: '',
      inviteCode: '',
      schedules: [],
    },
  });

  const {
    refineCore: { query, onFinish },
    handleSubmit,
    formState: { isSubmitting },
    control,
    reset,
    getValues,
  } = form;

  // Submit handler with banner upload
  const onSubmit = async (values: {
    name: string;
    teacherId: string;
    status: 'active' | 'inactive';
    subjectId?: unknown;
    capacity?: unknown;
    description?: string;
    bannerUrl?: string;
    bannerCldPubId?: string;
    inviteCode?: string;
    schedules?: ClassSchedule[];
  }) => {
    try {
      // Upload banner if a new one is provided and updateBanner is true
      if (updateBanner && banner?.length > 0) {
        console.log('Uploading new banner to Cloudinary...');
        const formData = new FormData();
        formData.append('file', banner[0]);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Cloudinary upload failed: ${response.statusText}`);
        }

        const data = await response.json();

        values.bannerUrl = data.url;
        values.bannerCldPubId = data.public_id;
      }

      // Add schedules and invite code to final values
      values.schedules = schedules;
      values.inviteCode = inviteCode;

      await onFinish(values);
      setUpdateBanner(false);
      setBanner([]);
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };

  // Fetch subjects list
  const { query: subjectsQuery } = useList<Subject>({
    resource: 'subjects',
    pagination: {
      pageSize: 100,
    },
  });

  // Fetch teachers list
  const { query: teachersQuery } = useList<User>({
    resource: 'users',
    filters: [
      {
        field: 'role',
        operator: 'eq',
        value: 'teacher',
      },
    ],
    pagination: {
      pageSize: 100,
    },
  });

  const classData = query?.data?.data as Class | undefined;

  if (classData && !getValues('subjectId')) {
    reset({
      name: classData?.name ?? '',
      subjectId: classData?.subjectId ?? undefined,
      teacherId: classData?.teacherId ?? undefined,
      capacity: classData?.capacity ?? undefined,
      description: classData?.description ?? '',
      status: classData?.status ?? 'active',
      bannerUrl: classData?.bannerUrl ?? '',
      bannerCldPubId: classData?.bannerCldPubId ?? '',
      schedules: classData?.schedules ?? [],
    });
  }

  useEffect(() => {
    // Set schedules and invite code whenever classData is available
    if (classData && schedules?.length === 0) {
      setSchedules(classData.schedules || []);
    }
    if (classData && !inviteCode) {
      setInviteCode(classData.inviteCode || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classData]);

  // Delete hook & handler
  const {
    mutate: deleteUser,
    mutation: { isPending },
  } = useDelete();

  const onDeleteHandler = () => {
    deleteUser({
      resource: 'classes',
      id: id as string,
    });
    invalidate({
      resource: 'classes',
      invalidates: ['list'],
    });
    reset();
    list('classes');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateCode = async () => {
    {
      const newCode = generateInviteCode();
      setRegenerating(true);
      setTimeout(() => {
        setInviteCode(newCode);
        setRegenerating(false);
      }, 1000);
    }
  };

  const teachers = teachersQuery.data?.data || [];
  const subjects = subjectsQuery.data?.data || [];
  const subjectsLoading = subjectsQuery.isLoading;
  const teachersLoading = teachersQuery.isLoading;
  const isDataLoading = query?.isLoading || !classData;

  // Show loader while data is loading
  if (isDataLoading) {
    return (
      <EditView className='container mx-auto pb-8 px-2 sm:px-4'>
        <div className='flex items-center justify-center h-[60vh]'>
          <div className='flex flex-col items-center gap-4'>
            <Loader2 className='h-12 w-12 animate-spin text-orange-600' />
            <p className='text-lg font-semibold text-gray-600'>
              Loading class data...
            </p>
          </div>
        </div>
      </EditView>
    );
  }

  return (
    <EditView className='container mx-auto pb-8 px-2 sm:px-4'>
      <Breadcrumb />

      <h1 className='text-3xl font-bold text-foreground tracking-tight'>
        Edit Class
      </h1>
      <div className='flex flex-col gap-5 md:flex-row justify-between'>
        <p>Provide the required information below to update.</p>
        <div className='flex flex-col md:flex-row max-sm:w-full border gap-2'>
          <Button className='max-sm:w-full' onClick={() => back()}>
            Go Back
          </Button>
          <Button
            className='bg-orange-600 cursor-pointer'
            rel='noopener noreferrer'
            onClick={() => show('classes', id as string)}
          >
            View Page
          </Button>
        </div>
      </div>

      <Separator />

      <div className='my-4 flex items-center'>
        <Card className='max-w-3xl gap-2 w-full mx-auto relative overflow-hidden border-gray-200 border shadow-sm'>
          <CardHeader className='relative z-10'>
            <CardTitle className='text-2xl pb-0 font-bold text-gradient-orange'>
              {classData?.name}
            </CardTitle>
          </CardHeader>

          <Separator className='py-0 bg-gray-200' />

          <CardContent className='mt-7'>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                <div className='space-y-2'>
                  <Label className='text-gray-900 font-semibold text-sm'>
                    Class Banner
                  </Label>

                  {updateBanner ? (
                    <FileUploader
                      files={banner}
                      onChange={setBanner}
                      type='banner'
                      maxSizeText='PNG, JPG up to 3MB'
                    />
                  ) : (
                    <div className='relative'>
                      <AdvancedImage
                        cldImg={bannerPhoto(
                          classData?.bannerCldPubId ?? '',
                          classData?.name ?? ''
                        )}
                        alt='Class Banner'
                        className=' w-full aspect-[5/1] rounded-lg object-cover border-2 border-gray-200'
                      />

                      <Button
                        type='button'
                        size='sm'
                        onClick={() => setUpdateBanner(true)}
                        className='absolute top-4 right-6 shadow-md bg-gradient-teal hover:shadow-lg transition-all cursor-pointer'
                      >
                        Replace photo
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                <FormField
                  control={control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-900 font-semibold'>
                        Class Name <span className='text-orange-600'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Introduction to Biology - Section A'
                          {...field}
                          className='bg-gray-0 border-2 border-gray-200 transition-all duration-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 h-11'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid sm:grid-cols-2 gap-4'>
                  <FormField
                    control={control}
                    name='subjectId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-900 font-semibold'>
                          Subject <span className='text-orange-600'>*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={
                            field.value ? field.value.toString() : undefined
                          }
                          disabled={subjectsLoading}
                        >
                          <FormControl>
                            <SelectTrigger className='bg-gray-0 w-full !h-11 border-2 border-gray-200'>
                              <SelectValue placeholder='Select a subject' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjects.map((subject: Subject) => (
                              <SelectItem
                                key={subject.id}
                                value={subject.id.toString()}
                              >
                                {subject.name} ({subject.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name='teacherId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-900 font-semibold'>
                          Teacher <span className='text-orange-600'>*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                          disabled={teachersLoading}
                        >
                          <FormControl>
                            <SelectTrigger className='bg-gray-0 w-full !h-11 border-2 border-gray-200'>
                              <SelectValue placeholder='Select a teacher' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teachers.map((teacher: User) => (
                              <SelectItem
                                key={teacher.id}
                                value={teacher.id.toString()}
                              >
                                {teacher.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid sm:grid-cols-2 gap-4'>
                  <FormField
                    control={control}
                    name='capacity'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-900 font-semibold'>
                          Capacity
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='30'
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value ? Number(value) : undefined);
                            }}
                            value={(field.value as number | undefined) ?? ''}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            className='bg-gray-0 border-2 border-gray-200 transition-all duration-300 h-11'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-900 font-semibold'>
                          Status <span className='text-orange-600'>*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='bg-gray-0 w-full !h-11 border-2 border-gray-200'>
                              <SelectValue placeholder='Select status' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='active'>Active</SelectItem>
                            <SelectItem value='inactive'>Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-900 font-semibold'>
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Brief description about the class'
                          {...field}
                          className='bg-gray-0 border-2 border-gray-200 transition-all duration-300 h-20'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className='space-y-2'>
                  <ScheduleInput
                    schedules={schedules}
                    onChange={setSchedules}
                  />
                </div>

                <Separator />

                {/* Invite Code Section */}
                <div className='space-y-3  p-4 bg-gray-50 rounded-lg border border-gray-200'>
                  <Label className='text-gray-900 font-semibold text-sm'>
                    Invite Code
                  </Label>
                  <p className='text-xs text-gray-600'>
                    Students use this code to join the class. You can regenerate
                    it if needed.
                  </p>
                  <div className='flex-col lg:flex-row flex gap-2 items-center'>
                    <div className='flex-1 w-full p-2 bg-white rounded-lg border border-orange-200'>
                      <p className='text-xl font-black text-orange-600 tracking-widest font-mono text-center'>
                        {inviteCode ? inviteCode : 'Loading...'}
                      </p>
                    </div>
                    <Button
                      type='button'
                      variant='outline'
                      size='lg'
                      onClick={handleCopyCode}
                      disabled={!inviteCode}
                      className='border cursor-pointer max-lg:w-full h-11 border-orange-600 bg-orange-50'
                    >
                      {copied ? (
                        <>
                          <Check className='h-4 w-4 mr-2' />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className='h-4 w-4 mr-2' />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      size='lg'
                      onClick={handleRegenerateCode}
                      className='border cursor-pointer max-lg:w-full h-11 border-teal-600 bg-teal-50'
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-2 ${
                          regenerating ? 'animate-spin' : ''
                        }`}
                      />
                      {regenerating ? 'Regenerating...' : 'Regenerate'}
                    </Button>
                  </div>
                </div>

                <Separator />

                <section className='flex flex-col sm:flex-row justify-between w-full gap-2'>
                  <ConfirmationModal
                    onClickHandler={onDeleteHandler}
                    isPending={isPending}
                  >
                    <Button
                      type='button'
                      variant='destructive'
                      className='max-sm:w-full h-12 px-6 font-semibold transition-all duration-300 cursor-pointer'
                    >
                      Delete
                    </Button>
                  </ConfirmationModal>

                  <Button
                    type='submit'
                    size='lg'
                    className='max-sm:w-full h-12 font-semibold text-white shadow-lg transition-all duration-300 cursor-pointer bg-purple-500'
                    disabled={isSubmitting || isPending}
                  >
                    {isSubmitting ? (
                      <div className='flex gap-1'>
                        <span>Saving... </span>{' '}
                        <Loader2 className='inline-block ml-2 animate-spin' />
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </section>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </EditView>
  );
};
