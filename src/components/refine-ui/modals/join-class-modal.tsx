import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useCreate,
  useGetIdentity,
  // useList,
  HttpError,
  useOne,
} from '@refinedev/core';
import { cleanInviteCode } from '@/lib/utils/classCode';
import { CheckCircle2 } from 'lucide-react';
import { User, Class } from '@/types';

interface JoinClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: number;
}

export const JoinClassModal = ({
  open,
  onOpenChange,
  classId,
}: JoinClassModalProps) => {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const { data: identity } = useGetIdentity<User>();

  const {
    mutate: createEnrollment,
    mutation: { isPending },
  } = useCreate();
  const isLoading = isPending || false;

  const { result: classData } = useOne<Class>({
    resource: 'classes',
    id: classId,
  });

  console.log('classData in JoinClassModal:', classData);

  const handleJoin = () => {
    const cleanedCode = cleanInviteCode(inviteCode);

    // Validate code length
    if (!cleanedCode || cleanedCode.length !== 6) {
      setError('Please enter a valid 6-character invite code');
      return;
    }

    // Validate user identity
    if (!identity?.id) {
      setError('Unable to identify user. Please try logging in again.');
      return;
    }

    // Validate that the invite code exists in a class
    const matchingClass = classData?.inviteCode === cleanedCode;

    if (!matchingClass) {
      setError('Invalid invite code. Please check and try again.');
      return;
    }

    // Check if class is active
    if (classData.status !== 'active') {
      setError('This class is not accepting new students.');
      return;
    }

    setError('');

    // Create enrollment
    createEnrollment(
      {
        resource: 'enrollments',
        values: {
          studentId: identity.id,
          classId: classData.id,
        },
      },
      {
        onSuccess: () => {
          setInviteCode('');
          setError('');
          onOpenChange(false);
        },
        onError: (error: HttpError) => {
          console.error('Join class error:', error);
          const errorMessage =
            error?.message || 'Failed to join class. Please try again.';
          setError(errorMessage);
        },
      }
    );
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = cleanInviteCode(value);

    // Limit to 6 characters
    if (cleaned.length <= 6) {
      setInviteCode(cleaned);
      setError('');
    }
  };

  const handleClose = () => {
    setInviteCode('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold flex items-center gap-2'>
            <div className='w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center'>
              <CheckCircle2 className='h-6 w-6 text-white' />
            </div>
            Join Class
          </DialogTitle>
          <DialogDescription className='text-sm pt-2'>
            {(classData?.students?.length ?? 0) >=
            (classData?.capacity || 0) ? (
              <span className='text-red-500 font-bold'>
                You can no longer join. This class is full.
              </span>
            ) : (
              <span>
                Enter the 6-character invite code provided by your teacher to
                join the class.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 pt-4'>
          <div className='space-y-2'>
            <Label htmlFor='inviteCode' className='text-sm font-semibold'>
              Invite Code
            </Label>
            <p className='text-xs text-gray-500'>
              The code is case-insensitive and should be 6 characters long
            </p>
            <Input
              id='inviteCode'
              placeholder='ABC123'
              value={inviteCode}
              onChange={handleCodeChange}
              className={`text-center text-2xl text-orange-600 font-bold tracking-widest uppercase h-14 ${
                error ? 'border-red-500 focus-visible:ring-red-500' : ''
              }`}
              maxLength={7}
              disabled={
                isLoading || classData?.capacity === classData?.students?.length
              }
            />
            {error && (
              <p className='text-sm font-medium text-red-600 flex items-center gap-1'>
                {error}
              </p>
            )}
          </div>

          <div className='flex gap-3 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              className='flex-1'
              disabled={
                isLoading || classData?.capacity === classData?.students?.length
              }
            >
              Cancel
            </Button>
            <Button
              type='button'
              onClick={handleJoin}
              className='flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold'
              disabled={inviteCode.length !== 6 || isLoading}
            >
              {isLoading ? 'Joining...' : 'Join Class'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
