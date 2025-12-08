import { UserAvatar } from '@/components/refine-ui/layout/user-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Link, useGetIdentity, useLogout } from '@refinedev/core';
import { LogOutIcon, UserIcon } from 'lucide-react';

export const Header = () => {
  const { isMobile } = useSidebar();

  return <>{isMobile ? <MobileHeader /> : <DesktopHeader />}</>;
};

function DesktopHeader() {
  return (
    <header className='sticky top-0 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-sidebar pr-3 justify-end z-40'>
      <UserDropdown />
    </header>
  );
}

function MobileHeader() {
  const { open, isMobile } = useSidebar();

  return (
    <header className='sticky top-0 flex h-12 shrink-0 items-center gap-2 border-b border-border bg-sidebar pr-3 justify-between z-40'>
      <SidebarTrigger
        className={cn('text-muted-foreground rotate-180 ml-1', {
          'opacity-0': open,
          'opacity-100': !open || isMobile,
          'pointer-events-auto': !open || isMobile,
          'pointer-events-none': open && !isMobile,
        })}
      />

      <div
        className={cn(
          'whitespace-nowrap flex flex-row h-full items-center justify-start gap-2 transition-discrete duration-200',
          {
            'pl-3': !open,
            'pl-5': open,
          }
        )}
      >
        <UserDropdown />
      </div>
    </header>
  );
}

const UserDropdown = () => {
  const { data: user } = useGetIdentity();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='rounded-full flex gap-2 items-center focus:outline-none'>
        <div className='flex flex-col text-right mr-2'>
          <span className='font-bold text-sm text-orange-600'>
            {user?.name}
          </span>
          <span className='text-xs text-gray-400/80 capitalize'>
            {user?.role}
          </span>
        </div>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild>
          <Link to={`/users/edit/${user?.id}`} className='cursor-pointer'>
            <UserIcon />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            logout();
          }}
          className='cursor-pointer'
        >
          <LogOutIcon className='text-destructive hover:text-destructive' />
          <span className='text-destructive hover:text-destructive'>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Header.displayName = 'Header';
MobileHeader.displayName = 'MobileHeader';
DesktopHeader.displayName = 'DesktopHeader';
