import { useForm } from '@refinedev/react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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

import { EditView } from '@/components/refine-ui/views/edit-view';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';

import { DEPARTMENT_OPTIONS } from '@/constants';
import { Textarea } from '@/components/ui/textarea';
import {
  useBack,
  useInvalidate,
  useNavigation,
  useResourceParams,
  useDelete,
} from '@refinedev/core';
import { Loader2 } from 'lucide-react';
import { Subject } from '@/types';
import { subjectSchema } from '@/lib/schema';
import { ConfirmationModal } from '@/components/refine-ui/modals/confirmation-modal';

export const SubjectsEdit = () => {
  const { id } = useResourceParams();
  const { list } = useNavigation();
  const invalidate = useInvalidate();
  const back = useBack();

  const form = useForm({
    resolver: zodResolver(subjectSchema),
    refineCoreProps: {
      resource: 'subjects',
      action: 'edit',
      id: id,
      redirect: false,
    },
    defaultValues: {
      name: '',
      code: '',
      description: '',
      department: '',
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

  const subject = query?.data?.data as Subject | undefined;

  if (subject && getValues('department') === '') {
    reset({
      name: subject.name ?? '',
      code: subject.code ?? '',
      description: subject.description ?? '',
      department: subject.department ?? '',
    });
  }

  // Delete hook & handler
  const {
    mutate: deleteUser,
    mutation: { isPending },
  } = useDelete();

  const onDeleteHandler = () => {
    deleteUser({
      resource: 'subjects',
      id: id as string,
    });
    invalidate({
      resource: 'subjects',
      invalidates: ['list'],
    });
    reset();
    list('subjects');
  };

  const isDataLoading = query?.isLoading || !subject;

  // Show loader while data is loading
  if (isDataLoading) {
    return (
      <EditView className='container mx-auto pb-8 px-2 sm:px-4'>
        <div className='flex items-center justify-center h-[60vh]'>
          <div className='flex flex-col items-center gap-4'>
            <Loader2 className='h-12 w-12 animate-spin text-orange-600' />
            <p className='text-lg font-semibold text-gray-600'>
              Loading subject data...
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
        Edit Subject
      </h1>
      <div className='flex flex-col gap-5 md:flex-row justify-between'>
        <p>Provide the required information below to update.</p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>

      <Separator />

      <div className='my-4 flex items-center'>
        <Card className='max-w-3xl gap-2 w-full mx-auto relative overflow-hidden shadow-sm border border-gray-200'>
          <CardHeader className='relative z-10'>
            <CardTitle className='text-2xl pb-0 font-bold text-gradient-orange'>
              {subject?.name}
            </CardTitle>
          </CardHeader>

          <Separator className='py-0 bg-gray-200' />

          <CardContent className='mt-7'>
            <Form {...form}>
              <form onSubmit={handleSubmit(onFinish)} className='space-y-5'>
                <FormField
                  control={control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-900 font-semibold'>
                        Subject Name <span className='text-orange-600'>*</span>
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

                <div className='grid sm:grid-cols-2 gap-4'>
                  <FormField
                    control={control}
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
                    control={control}
                    name='department'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-900 font-semibold'>
                          Department <span className='text-orange-600'>*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || undefined}
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
                  control={control}
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
