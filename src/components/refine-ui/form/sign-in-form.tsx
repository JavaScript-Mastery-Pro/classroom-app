'use client';

import { useLogin, useLink } from '@refinedev/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { toast } from 'sonner';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export const SignInForm = () => {
  const { mutate: login, isPending } = useLogin();
  const Link = useLink();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: SignInFormValues) => {
    try {
      login(values, {
        onSuccess: (data) => {
          //Since the methods of authProvider always return a resolved promise, you can handle errors by using the success value in the response
          if (data.success === false) {
            toast.error(data.error?.message, {
              richColors: true,
            });
            return;
          }

          toast.success('Welcome back!', {
            richColors: true,
          });
          form.reset();
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        richColors: true,
      });
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

        <CardHeader className='px-0 relative z-10'>
          <CardTitle className='text-4xl font-bold mb-2 text-gradient-orange'>
            Welcome Back
          </CardTitle>
          <CardDescription className='text-gray-900 font-medium text-base'>
            Login to your classroom.
          </CardDescription>
        </CardHeader>

        <CardContent className='px-0 relative z-10'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-900 font-semibold'>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='Enter your email'
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
                  <FormItem className='mt-6'>
                    <FormLabel className='text-gray-900 font-semibold'>
                      Password
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
                className='w-full mt-7 h-12 font-semibold text-white shadow-lg cursor-pointer bg-gradient-orange-diagonal'
                disabled={form.formState.isSubmitting || isPending}
              >
                {form.formState.isSubmitting || isPending
                  ? 'Signing in...'
                  : 'Sign in'}
              </Button>
            </form>
          </Form>

          <CardFooter className='mt-6 w-full text-center text-sm px-0'>
            <span className='text-gray-900 mr-2'>Don't have an account? </span>
            <Link
              to='/register'
              className='font-bold underline hover:no-underline transition-all text-teal-600'
            >
              Create account
            </Link>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};
