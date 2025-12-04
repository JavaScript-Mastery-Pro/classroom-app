import { useGetIdentity, useInvalidate, useUpdate } from '@refinedev/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_UPLOAD_URL } from '@/constants';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  image: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfilePage = () => {
  const { data: user } = useGetIdentity();
  const [profile, setProfile] = useState<File[]>([]);
  const [updateProfile, setUpdateProfile] = useState(false);
  const invalidate = useInvalidate();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      image: user?.image || '',
    },
  });

  const {
    mutate: update,
    mutation: { isPending: isUpdating },
  } = useUpdate();

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user?.id) return;

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

        update(
          {
            resource: 'users',
            id: user.id,
            values: {
              ...values,
              name: values.name,
              image: uploadedImage.secure_url,
              imageCldPubId: uploadedImage.public_id,
            },
          },
          {
            onSuccess: () => {
              invalidate({ resource: 'getUserIdentity', invalidates: ['all'] });
              setUpdateProfile(false);
              setProfile([]);
            },
          }
        );

        return;
      }

      update(
        {
          resource: 'users',
          id: user.id,
          values: {
            ...values,
            name: values.name,
          },
        },
        {
          onSuccess: () => {
            invalidate({ resource: 'users', invalidates: ['all'] });
          },
        }
      );
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className='py-8 flex items-center size-full px-4'>
      <Card className='max-w-xl w-full mx-auto relative overflow-hidden bg-gray-0 border-0'>
        <div className='absolute top-0 left-0 right-0 h-2 bg-gradient-orange' />

        <CardHeader className='relative z-10'>
          <CardTitle className='text-3xl font-bold text-gradient-orange'>
            My Profile
          </CardTitle>
          <CardDescription className='text-gray-900 font-medium'>
            Manage your account information and profile photo
          </CardDescription>
        </CardHeader>

        <Separator className='bg-gray-200' />

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
                    <div className='relative flex-shrink-0'>
                      <UserAvatar size='large' />
                    </div>

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

              <FormField
                control={form.control}
                name='name'
                defaultValue={user?.name || ''}
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
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <FormLabel className='text-gray-900 font-semibold'>
                    Email
                  </FormLabel>
                  <div className='px-3 text-sm capitalize py-2.5 rounded-md bg-gray-50 border-2 border-gray-200 text-gray-900 font-medium'>
                    {user?.email}
                  </div>
                </div>
                {/* Role Display (Read-only) */}
                <div className='space-y-2'>
                  <FormLabel className='text-gray-900 font-semibold'>
                    Role
                  </FormLabel>
                  <div className='px-3 text-sm capitalize py-2.5 rounded-md bg-gray-50 border-2 border-gray-200 text-gray-900 font-medium'>
                    {user?.role}
                  </div>
                </div>
              </div>

              <section className='flex flex-col gap-2'>
                <Button
                  type='submit'
                  size='lg'
                  className='w-full h-12 font-semibold text-white shadow-lg transition-all duration-300 cursor-pointer bg-gradient-orange-diagonal'
                  disabled={form.formState.isSubmitting || isUpdating}
                >
                  {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                  {isUpdating && (
                    <Loader2 className='inline-block ml-2 animate-spin' />
                  )}
                </Button>
                <Button
                  type='button'
                  size='lg'
                  disabled={form.formState.isSubmitting || isUpdating}
                  onClick={() => {
                    form.reset();
                    setUpdateProfile(false);
                    setProfile([]);
                  }}
                  className='w-full h-12 font-semibold transition-all duration-300 cursor-pointer text-white bg-gray-800'
                >
                  Cancel
                </Button>
              </section>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
