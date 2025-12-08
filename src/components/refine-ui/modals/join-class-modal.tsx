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
  useCustomMutation,
  useNotification,
  useGetIdentity,
} from '@refinedev/core';
import { cleanInviteCode } from '@/lib/utils/classCode';
import { CheckCircle2 } from 'lucide-react';
import { User } from '@/types';

interface JoinClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JoinClassModal = ({ open, onOpenChange }: JoinClassModalProps) => {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const { open: openNotification } = useNotification();
  const { data: identity } = useGetIdentity<User>();

  const { mutate: joinClass } = useCustomMutation();

  console.log('JoinClassModal identity:', identity);
  const handleJoin = () => {
    const code = cleanInviteCode(inviteCode);

    console.log('Attempting to join class with:', {
      inviteCode: code,
      studentId: identity?.id,
      url: `${import.meta.env.VITE_API_URL}/classes/join`,
    });

    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-character invite code');
      return;
    }

    if (!identity?.id) {
      setError('Unable to identify user. Please try logging in again.');
      return;
    }

    setError('');

    joinClass(
      {
        url: `${import.meta.env.VITE_API_URL}/classes/join`,
        method: 'post',
        values: {
          inviteCode: code,
          studentId: identity.id,
        },
      },
      {
        onSuccess: (data) => {
          console.log('Join class success:', data);
          openNotification?.({
            type: 'success',
            message: 'Successfully joined class!',
            description:
              data?.data?.message || 'You have been enrolled in the class',
          });
          setInviteCode('');
          onOpenChange(false);
        },
        onError: (error) => {
          console.error('Join class error:', error);
          console.error('Error response:', error?.response);
          console.error('Error data:', error?.response?.data);

          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Invalid invite code or unable to join class';
          setError(errorMessage);
          openNotification?.({
            type: 'error',
            message: 'Failed to join class',
            description: errorMessage,
          });
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
            Join a Class
          </DialogTitle>
          <DialogDescription className='text-base pt-2'>
            Enter the 6-character invite code provided by your teacher to join
            the class.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 pt-4'>
          <div className='space-y-2'>
            <Label htmlFor='inviteCode' className='text-sm font-semibold'>
              Invite Code
            </Label>
            <Input
              id='inviteCode'
              placeholder='ABC123'
              value={inviteCode}
              onChange={handleCodeChange}
              className={`text-center text-2xl font-bold tracking-widest uppercase h-14 ${
                error ? 'border-red-500 focus-visible:ring-red-500' : ''
              }`}
              maxLength={7} // ABC-123 with dash
              // disabled={isLoading}
            />
            {error && (
              <p className='text-sm font-medium text-red-600 flex items-center gap-1'>
                {error}
              </p>
            )}
            <p className='text-xs text-gray-500'>
              The code is case-insensitive and should be 6 characters long
            </p>
          </div>

          <div className='flex gap-3 pt-2'>
            <Button
              variant='outline'
              onClick={handleClose}
              className='flex-1'
              // disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoin}
              className='flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold'
              disabled={inviteCode.length !== 6}
            >
              {/* {isLoading ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin mr-2' />
                  Joining...
                </>
              ) : (
                'Join Class'
              )} */}
              Join Class
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
