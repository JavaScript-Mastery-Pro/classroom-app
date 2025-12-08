import { useForm } from '@refinedev/react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
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

import { CreateView } from '@/components/refine-ui/views/create-view';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { FileUploader } from '@/components/refine-ui/form/file-uploader';
import { ScheduleInput } from '@/components/refine-ui/form/schedule-input';

import { Textarea } from '@/components/ui/textarea';
import { useBack, useList } from '@refinedev/core';
import { Loader2 } from 'lucide-react';
import { classSchema } from '@/lib/schema';
import { ClassSchedule, Subject, User } from '@/types';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_UPLOAD_URL } from '@/constants';

export const ClassesCreate = () => {
  const back = useBack();
  const [banner, setBanner] = useState<File[]>([]);
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);

  const form = useForm({
    resolver: zodResolver(classSchema),
    refineCoreProps: {
      resource: 'classes',
      action: 'create',
      redirect: false,
    },
    defaultValues: {
      name: '',
      subjectId: undefined,
      teacherId: undefined,
      capacity: undefined,
      description: '',
      status: 'active',
      bannerUrl: '',
      bannerCldPubId: '',
      schedules: [],
    },
  });

  const {
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting },
    control,
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
    schedules?: ClassSchedule[];
    inviteCode?: string;
  }) => {
    try {
      // Upload banner if provided
      if (banner?.length > 0) {
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

      // Add schedules and invite code to values
      values.schedules = schedules;
      await onFinish(values);
    } catch (error) {
      console.error('Error creating class:', error);
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

  const teachers = teachersQuery.data?.data || [];
  const subjects = subjectsQuery.data?.data || [];
  const subjectsLoading = subjectsQuery.isLoading;
  const teachersLoading = teachersQuery.isLoading;

  return (
    <CreateView className='container mx-auto pb-8 px-2 sm:px-4'>
      <Breadcrumb />

      <h1 className='text-4xl font-bold text-foreground tracking-tight'>
        Create a Class
      </h1>
      <div className='flex flex-col gap-5 md:flex-row justify-between'>
        <p className='mt-2'>
          Provide the required information below to add a class.
        </p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>

      <Separator />

      <div className='my-4 flex items-center'>
        <Card className='max-w-3xl gap-2 w-full mx-auto relative overflow-hidden bg-gray-0 border-0'>
          <div className='absolute top-0 left-0 right-0 h-2 bg-gradient-orange' />

          <CardHeader className='relative z-10'>
            <CardTitle className='text-2xl pb-0 font-bold text-gradient-orange'>
              Fill out the class form
            </CardTitle>
          </CardHeader>

          <Separator className='py-0 bg-gray-200' />

          <CardContent className='mt-7'>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                <div className='space-y-2'>
                  <Label className='text-gray-900 font-semibold text-sm'>
                    Banner Image
                  </Label>
                  <FileUploader
                    files={banner}
                    onChange={setBanner}
                    type='banner'
                    maxSizeText='PNG, JPG up to 3MB'
                  />
                </div>
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
                          value={field.value?.toString()}
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
                          value={field.value}
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

                <div className='space-y-2'>
                  <ScheduleInput
                    schedules={schedules}
                    onChange={setSchedules}
                  />
                </div>

                <Separator />

                <Button
                  type='submit'
                  size='lg'
                  className='w-full mt-2 h-12 font-semibold text-white shadow-lg cursor-pointer bg-gradient-orange-diagonal'
                  disabled={isSubmitting || subjectsLoading || teachersLoading}
                >
                  {isSubmitting ? (
                    <div className='flex gap-1'>
                      <span>Creating Class...</span>
                      <Loader2 className='inline-block ml-2 animate-spin' />
                    </div>
                  ) : (
                    'Create Class'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};
