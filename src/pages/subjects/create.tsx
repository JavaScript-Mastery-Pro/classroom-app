import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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

import { DEPARTMENT_OPTIONS } from '@/constants';
import { Textarea } from '@/components/ui/textarea';
import {
  useBack,
  useCreate,
  useInvalidate,
  useNavigation,
} from '@refinedev/core';
import { Loader2 } from 'lucide-react';

const subjectSchema = z.object({
  name: z.string().min(3, 'Subject name must be at least 3 characters'),
  code: z.string().min(5, 'Subject code must be at least 5 characters'),
  description: z
    .string()
    .min(5, 'Subject description must be at least 5 characters'),
  department: z
    .string()
    .min(2, 'Subject department must be at least 2 characters'),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

export const SubjectsCreate = () => {
  const invalidate = useInvalidate();
  const { list } = useNavigation();
  const back = useBack();

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      department: '',
    },
  });

  const {
    mutate: create,
    mutation: { isPending: isCreating },
  } = useCreate();

  const onSubmit = async (values: SubjectFormValues) => {
    console.log('Creating subject with values:', values);
    try {
      create(
        {
          resource: 'subjects',
          values,
        },
        {
          onSuccess: () => {
            // Invalidate the subjects list to refresh the data
            invalidate({
              resource: 'subjects',
              invalidates: ['all'],
            });

            // Navigate to the subjects list page
            list('subjects');
          },
        }
      );
    } catch (error) {
      console.error('Error creating subject:', error);
    }
  };

  return (
    <CreateView className='container mx-auto pb-8 px-2 sm:px-4'>
      <Breadcrumb />
      <div className='space-y-4 mb-6'>
        <h1 className='text-4xl font-bold text-foreground tracking-tight'>
          Create Subject
        </h1>
        <div className='flex flex-col gap-5 lg:flex-row justify-between'>
          <p className='mt-2'>
            Provide the required information below to add a subject.
          </p>

          <div className='flex flex-col gap-3 sm:flex-row sm:gap-2 w-full sm:w-auto'>
            <Button onClick={() => back()}>Go Back</Button>
          </div>
        </div>
        <Separator />

        <div className='my-8 pt-5 flex items-center  px-4'>
          <Card className='max-w-4xl gap-2 w-full mx-auto relative overflow-hidden bg-gray-0 border-0'>
            <div className='absolute top-0 left-0 right-0 h-2 bg-gradient-orange' />

            <CardHeader className='relative z-10'>
              <CardTitle className='text-2xl pb-0 font-bold text-gradient-orange'>
                Fill out the subject form
              </CardTitle>
            </CardHeader>

            <Separator className='py-0 bg-gray-200' />

            <CardContent className='mt-7'>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-5'
                >
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-900 font-semibold'>
                          Subject Name{' '}
                          <span className='text-orange-600'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Mathematics'
                            {...field}
                            className='bg-gray-0 border-2 border-gray-200 transition-all duration-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 h-11'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='code'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-gray-900 font-semibold'>
                            Subject Code{' '}
                            <span className='text-orange-600'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type='text'
                              placeholder='MATH101'
                              {...field}
                              className='bg-gray-0 border-2 border-gray-200 transition-all duration-300 h-11'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='department'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-gray-900 font-semibold'>
                            Department{' '}
                            <span className='text-orange-600'>*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className='bg-gray-0 w-full !h-11 border-2 border-gray-200'>
                                <SelectValue placeholder='Select a department' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DEPARTMENT_OPTIONS.map((dept) => (
                                <SelectItem key={dept.value} value={dept.value}>
                                  {dept.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-900 font-semibold'>
                          Subject Description{' '}
                          <span className='text-orange-600'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Introduction to Mathematics'
                            {...field}
                            className='bg-gray-0 border-2 border-gray-200 transition-all duration-300 h-20'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type='submit'
                    size='lg'
                    className='w-full mt-2 h-12 font-semibold text-white shadow-lg cursor-pointer bg-gradient-orange-diagonal'
                    disabled={form.formState.isSubmitting || isCreating}
                  >
                    {form.formState.isSubmitting || isCreating ? (
                      <div className='flex gap-1'>
                        <span>Creating Subject...</span>
                        <Loader2 className='inline-block ml-2 animate-spin' />
                      </div>
                    ) : (
                      'Create Subject'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </CreateView>
  );
};
