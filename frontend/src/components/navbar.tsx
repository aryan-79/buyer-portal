import { HeartIcon } from '@phosphor-icons/react';
import { getRouteApi, Link, useRouteContext, useRouter } from '@tanstack/react-router';
import { useDebounceCallback } from '@/lib/hooks/use-debounce';
import Logo from './logo';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Route = getRouteApi('/_layout');

export default function Navbar() {
  const { session } = useRouteContext({
    from: '__root__',
  });

  const searchParams = Route.useSearch();
  const { latestLocation } = useRouter();

  const navigate = Route.useNavigate();

  const handleChange = useDebounceCallback((val: string) => {
    navigate({
      to: latestLocation.pathname,
      search: (prev) => {
        return { ...prev, search: val || undefined };
      },
      replace: true,
    });
  });

  return (
    <nav className='flex justify-between items-center gap-4 container p-4 sticky top-0 bg-background z-50'>
      <Logo className='size-6 md:size-8 [&>svg]:size-4' showName />
      <div className='flex gap-4 items-center'>
        <Input
          key={latestLocation.pathname}
          defaultValue={searchParams.search}
          onChange={(e) => {
            const val = e.target.value;
            handleChange(val);
          }}
          placeholder='Search'
          className='border-border'
        />
        {session?.fullName && <span>{session.fullName}</span>}
        {session ? (
          <Button variant='outline' render={<Link to='/favourites' search={{}} />} nativeButton={false}>
            <HeartIcon /> Favourites
          </Button>
        ) : (
          <Button render={<Link to='/login' />} nativeButton={false}>
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}
