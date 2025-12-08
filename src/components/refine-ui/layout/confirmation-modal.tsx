import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { useState } from 'react';

export const ConfirmationModal = ({
  onClickHandler,
  isPending,
  children,
}: {
  onClickHandler: () => void;
  isPending: boolean;
  children: React.ReactNode;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className='bg-card border-border'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-foreground'>
            Are you sure you want to delete?
          </AlertDialogTitle>
          <AlertDialogDescription className='text-muted-foreground'>
            This action cannot be undone. This will permanently delete the
            subject and remove all associated data from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className='border-border cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground'
            disabled={isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onClickHandler}
            disabled={isPending}
            className='bg-destructive cursor-pointer text-white hover:bg-destructive/90'
          >
            {isPending ? 'Deleting...' : 'Confirm Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
