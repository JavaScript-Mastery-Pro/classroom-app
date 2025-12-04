import { useGetIdentity } from '@refinedev/core';
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

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  image: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfilePage = () => {
  const { data: user } = useGetIdentity();
  const [profileFiles, setProfileFiles] = useState<File[]>();

  console.log('User data profile:', user);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      image: user?.image || '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user?.id) return;

    try {
      console.log('profile', values);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className=' min-h-screen py-8 px-4'>
      <Card className='max-w-2xl mx-auto  relative overflow-hidden bg-gray-0 border-0'>
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

        <CardContent className='pt-2'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* Profile Photo Section */}
              <FileUploader
                files={profileFiles}
                onChange={setProfileFiles}
                // onUploadComplete={(url) => form.setValue('image', url)}
                type='profile'
                maxSizeText='PNG, JPG up to 5MB'
                currentImageUrl={user?.image}
              />

              {/* Name Fields */}
              <div className='grid grid-cols-2 gap-4'>
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

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name='email'
                  defaultValue={user?.email || ''}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-900 font-semibold'>
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          {...field}
                          className='bg-gray-0 border-2 border-gray-200 transition-all duration-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 h-11'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Role Display (Read-only) */}
              <div className='space-y-2'>
                <FormLabel className='text-gray-900 font-semibold'>
                  Role
                </FormLabel>
                <div className='px-3 capitalize py-2 rounded-md bg-gray-50 border-2 border-gray-200 text-gray-900 font-medium'>
                  {user?.role}
                </div>
              </div>

              <Button
                type='submit'
                size='lg'
                className='w-full h-12 font-semibold text-white shadow-lg transition-all duration-300 cursor-pointer bg-gradient-orange-diagonal'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
