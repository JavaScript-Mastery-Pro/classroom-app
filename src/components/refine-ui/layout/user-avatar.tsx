import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useGetIdentity } from '@refinedev/core';
import { AdvancedImage } from '@cloudinary/react';
import { profilePhoto } from '@/lib/cloudinary';
import { User } from '@/types';

export function UserAvatar({ size = 'small' }: { size?: 'small' | 'large' }) {
  const { data: user, isLoading: userIsLoading } = useGetIdentity<User>();

  if (userIsLoading || !user) {
    return <Skeleton className={cn('h-10', 'w-10', 'rounded-full')} />;
  }

  return (
    <Avatar
      className={cn('border-2 border-orange-500', {
        'h-10 w-10': size === 'small',
        'w-24 h-24 sm:w-26 sm:h-26 border-4': size === 'large',
      })}
    >
      {user.imageCldPubId && (
        <AdvancedImage
          cldImg={profilePhoto(user.imageCldPubId)}
          alt={user.name}
        />
      )}
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
}

const getInitials = (name = '') => {
  const names = name.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

UserAvatar.displayName = 'UserAvatar';
