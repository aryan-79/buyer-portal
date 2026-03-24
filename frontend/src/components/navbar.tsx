import { HeartIcon } from '@phosphor-icons/react';
import Logo from './logo';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Link, useRouteContext } from '@tanstack/react-router';

export default function Navbar() {
  const { session } = useRouteContext({
    from: '__root__',
  });
  return (
    <nav className='flex justify-between items-center gap-4 container p-4 sticky top-0 bg-background z-50'>
      <Logo className='size-6 md:size-8 [&>svg]:size-4' showName />
      <div className='flex gap-4 items-center'>
        <Input placeholder='Search' className='border-border' />
        {session ? (
          <Button variant='outline' render={<Link to='/favourites' />} nativeButton={false}>
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
