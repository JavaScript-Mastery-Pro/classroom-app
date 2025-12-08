import {
  useBack,
  useDelete,
  useInvalidate,
  useNavigation,
  useResourceParams,
} from '@refinedev/core';
import { useForm } from '@refinedev/react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FileUploader } from '@/components/refine-ui/form/file-uploader';
import { UserAvatar } from '@/components/refine-ui/layout/user-avatar';
import {
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_UPLOAD_URL,
  DEPARTMENT_OPTIONS,
} from '@/constants';
import { Loader2 } from 'lucide-react';
import { FacultyFormValues, User } from '@/types';
import { EditView } from '@/components/refine-ui/views/edit-view';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { ConfirmationModal } from '@/components/refine-ui/modals/confirmation-modal';
import { facultySchema } from '@/lib/schema';

export const UsersEdit = () => {
  const { id } = useResourceParams();
  const { list } = useNavigation();
  const invalidate = useInvalidate();
  const back = useBack();

  const [profile, setProfile] = useState<File[]>([]);
  const [updateProfile, setUpdateProfile] = useState(false);

  const form = useForm({
    resolver: zodResolver(facultySchema),
    refineCoreProps: {
      resource: 'users',
      action: 'edit',
      id: id,
      redirect: false,
    },
    defaultValues: {
      name: '',
      email: '',
      role: 'teacher',
      department: '',
      image: '',
      imageCldPubId: '',
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

  // Set form values when data is loaded
  const user = query?.data?.data as User | undefined;

  if (user && getValues('department') === '') {
    reset({
      name: user?.name ?? '',
      email: user?.email ?? '',
      role: user?.role ?? 'teacher',
      department: user?.department ?? '',
      image: user?.image ?? '',
      imageCldPubId: user?.imageCldPubId ?? '',
    });
  }

  // Submit handler
  const onSubmit = async (values: FacultyFormValues) => {
    try {
      if (profile?.length > 0) {
        const formData = new FormData();
        formData.append('file', profile?.[0]);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadedImage = await response.json();

        if (uploadedImage.error) {
          throw new Error(uploadedImage.error.message || 'Image upload failed');
        }

        await onFinish({
          ...values,
          image: uploadedImage.secure_url,
          imageCldPubId: uploadedImage.public_id,
        });
      } else {
        await onFinish(values);
      }

      setUpdateProfile(false);
      setProfile([]);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Delete hook & handler
  const {
    mutate: deleteSubject,
    mutation: { isPending },
  } = useDelete();

  const onDeleteHandler = () => {
    deleteSubject({
      resource: 'users',
      id: id as string,
    });
    invalidate({
      resource: 'users',
      invalidates: ['list'],
    });
    reset();
    list('users');
  };

  const isDataLoading = query?.isLoading || !user;

  // Show loader while data is loading
  if (isDataLoading) {
    return (
      <EditView className='container mx-auto pb-8 px-2 sm:px-4'>
        <div className='flex items-center justify-center h-[60vh]'>
          <div className='flex flex-col items-center gap-4'>
            <Loader2 className='h-12 w-12 animate-spin text-orange-600' />
            <p className='text-lg font-semibold text-gray-600'>
              Loading faculty data...
            </p>
          </div>
        </div>
      </EditView>
    );
  }

  return (
    <EditView className='container mx-auto pb-8 px-2 sm:px-4'>
      <Breadcrumb />

      <h1 className='text-4xl font-bold text-foreground tracking-tight'>
        Edit Faculty
      </h1>
      <div className='flex flex-col gap-5 md:flex-row justify-between'>
        <p className='mt-2'>
          Provide the required information below to update.
        </p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>

      <Separator />

      <div className='my-4 flex items-center'>
        <Card className='max-w-3xl gap-2 w-full mx-auto relative overflow-hidden bg-gray-0 border-0'>
          <div className='absolute top-0 left-0 right-0 h-2 bg-gradient-orange' />

          <CardHeader className='relative z-10'>
            <CardTitle className='text-2xl font-bold text-gradient-orange'>
              Update information
            </CardTitle>
          </CardHeader>

          <Separator className='bg-gray-200' />

          <CardContent className='mt-4'>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {updateProfile ? (
                  <FileUploader
                    files={profile}
                    onChange={setProfile}
                    type='profile'
                    maxSizeText='PNG, JPG up to 3MB'
                  />
                ) : (
                  <div className='relative w-full rounded-xl border-2 border-orange-600/20 bg-gradient-to-r from-orange-50/50 to-orange-100/30 p-5'>
                    <div className='flex flex-col sm:flex-row items-center gap-4'>
                      <p className='relative flex-shrink-0'>
                        {user && <UserAvatar size='large' user={user} />}
                      </p>

                      <div className='flex-1 text-center sm:text-left'>
                        <p className='text-[20px] font-bold text-gray-900'>
                          {user?.name}
                        </p>
                        <p className='text-xs font-medium text-gray-900/80'>
                          {user?.email} | {user?.role}
                        </p>
                      </div>
                      <div className='flex-shrink-0'>
                        <Button
                          type='button'
                          size='sm'
                          onClick={() => setUpdateProfile(true)}
                          className='shadow-md bg-gradient-teal hover:shadow-lg transition-all cursor-pointer'
                        >
                          Replace photo
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className='grid sm:grid-cols-2 gap-4'>
                  <FormField
                    control={control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-900 font-semibold'>
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className='bg-gray-0 border-2 border-gray-200 transition-all duration-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 h-11'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='space-y-2'>
                    <FormLabel className='text-gray-900 font-semibold'>
                      Email
                    </FormLabel>
                    <div className='px-3 text-sm py-2.5 cursor-not-allowed rounded-md bg-gray-100 border-2 border-gray-200 text-gray-900 font-medium'>
                      {user?.email}
                    </div>
                  </div>
                </div>

                <div className='grid sm:grid-cols-2 gap-4'>
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
                          value={field.value ?? ''}
                        >
                          <FormControl>
                            <SelectTrigger className='bg-gray-0 border-2 border-gray-200 transition-all duration-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 w-full !h-11'>
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

                  <FormField
                    control={control}
                    name='role'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-900 font-semibold'>
                          Role
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ''}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full border-2 border-gray-200 transition-all duration-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 !h-11'>
                              <SelectValue placeholder='Select a role' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='admin'>Admin</SelectItem>
                            <SelectItem value='teacher'>Teacher</SelectItem>
                            <SelectItem value='student'>Student</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <section className='flex-col-reverse sm:flex-row flex justify-between w-full gap-2'>
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
                    className='max-sm:w-full h-12 font-semibold text-white shadow-lg transition-all duration-300 cursor-pointer bg-gradient-orange-diagonal'
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
