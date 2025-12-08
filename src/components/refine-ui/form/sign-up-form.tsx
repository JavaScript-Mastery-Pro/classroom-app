import { useRegister, useLink } from '@refinedev/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { InputPassword } from '@/components/refine-ui/form/input-password';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

import { useState } from 'react';
import {
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_UPLOAD_URL,
  ROLE_OPTIONS,
} from '@/constants';
import { FileUploader } from '@/components/refine-ui/form/file-uploader';
import { UserRole } from '@/types';
import { toast } from 'sonner';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(3, 'Full name must be at least 3 characters'),
  role: z.nativeEnum(UserRole),
  image: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const SignUpForm = () => {
  const Link = useLink();
  const [profile, setProfile] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: register } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      role: UserRole.STUDENT,
      image: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);

    try {
      // Upload photo to cloudinary
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

        register(
          {
            ...values,
            name: values.name,
            image: uploadedImage.url,
            imageCldPubId: uploadedImage.public_id,
          },
          {
            onSuccess: (data) => {
              if (data.success === false) {
                toast.error(data.error?.message, {
                  richColors: true,
                });
                return;
              }

              toast.success('Account created successfully!', {
                richColors: true,
              });
              form.reset();
            },
          }
        );
      }

      register(
        {
          ...values,
          name: values.name,
        },
        {
          onSuccess: (data) => {
            if (data.success === false) {
              toast.error(data.error?.message, {
                richColors: true,
              });
              return;
            }

            toast.success('Account created successfully!', {
              richColors: true,
            });
            form.reset();
          },
        }
      );
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed', {
        richColors: true,
      });
      setProfile([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='grain-texture-light flex flex-col items-center justify-center p-4 md:px-6 md:py-8 min-h-svh'>
      <div className='flex mb-1 sm:mb-5 items-center justify-center gap-2'>
        <img src='/assets/logo-icon.png' alt='Logo' className='h-20 sm:h-24' />
      </div>

      <Card className='sm:w-full w-full max-w-[456px] p-8 mt-4 md:mt-6 relative overflow-hidden bg-gray-0 border-0'>
        {/* Decorative card top border accent */}
        <div className='absolute top-0 left-0 right-0 h-2 bg-gradient-orange' />
        {/* <div className='absolute top-0 right-0 w-32 h-32 opacity-5 bg-gradient-orange rounded-bl-full' />
        <div className='absolute bottom-0 left-0 w-24 h-24 opacity-5 bg-gradient-teal rounded-tr-full' /> */}

        <CardHeader className='px-0 relative z-10'>
          <CardTitle className='text-4xl font-bold mb-2 text-gradient-orange'>
            Register
          </CardTitle>
          <CardDescription className='text-gray-900 font-medium text-base'>
            Create an account to get started.
          </CardDescription>
        </CardHeader>

        <CardContent className='px-0 relative z-10'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
              {/* User Type Selection */}
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-900 font-semibold'>
                      Role <span className='text-orange-600'>*</span>
                    </FormLabel>
                    <FormControl>
                      <div className='grid w-full grid-cols-2 gap-3'>
                        {ROLE_OPTIONS.map((role) => {
                          return (
                            <button
                              key={role.value}
                              type='button'
                              onClick={() => field.onChange(role.value)}
                              className={cn(
                                'flex flex-col border-gray-200 items-center justify-center p-3 rounded-lg border transition-all duration-300 cursor-pointer',
                                field.value === role.value &&
                                  'border-orange-600 bg-gradient-orange-light'
                              )}
                            >
                              <role.icon className='h-7 w-7 mb-2 text-orange-600' />
                              <span className='text-sm font-bold text-orange-600'>
                                {role.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Profile Photo Upload */}
              <div className='flex flex-col gap-3'>
                <Label className='text-gray-900 font-semibold'>
                  Profile Photo
                </Label>

                <FileUploader
                  files={profile}
                  onChange={setProfile}
                  type='profile'
                  maxSizeText='PNG, JPG up to 3MB'
                />
              </div>

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-900 font-semibold'>
                      Full Name <span className='text-orange-600'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John Doe'
                        {...field}
                        className='bg-gray-0 border-2 border-gray-200 transition-all duration-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 h-11'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-900 font-semibold'>
                      Email <span className='text-orange-600'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='john.doe@example.com'
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
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-900 font-semibold'>
                      Password <span className='text-orange-600'>*</span>
                    </FormLabel>
                    <FormControl>
                      <InputPassword
                        {...field}
                        placeholder='Enter your password'
                        className='bg-gray-0 border-2 border-gray-200 transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 h-11'
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
                disabled={form.formState.isSubmitting || isLoading}
              >
                {form.formState.isSubmitting || isLoading
                  ? 'Creating Account...'
                  : 'Create Account'}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className='w-full text-center text-sm px-0'>
          <span className='text-gray-900 mr-2'>Already have an account? </span>
          <Link
            to='/login'
            className='font-bold underline hover:no-underline transition-all text-teal-600'
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
