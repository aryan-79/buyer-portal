import { HeartIcon } from '@phosphor-icons/react';
import { getRouteApi, Link, useRouteContext, useRouter } from '@tanstack/react-router';
import { getContext } from '@/integrations/tanstack-query/provider';
import { useDebounceCallback } from '@/lib/hooks/use-debounce';
import { defaultMutationOptions } from '@/lib/mutaiton-options';
import { usePostAuthLogout } from '@/lib/queries/query-components';
import Logo from './logo';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
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

  const { mutate: logout, isPending } = usePostAuthLogout(defaultMutationOptions());

  return (
    <nav className='flex justify-between items-center gap-4 container p-4 sticky top-0 bg-background z-50'>
      <Link to='/'>
        <Logo className='size-6 md:size-8 [&>svg]:size-4' showName />
      </Link>
      <div className='flex gap-2 items-center'>
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
        {session ? (
          <Button variant='outline' render={<Link to='/favourites' search={{}} />} nativeButton={false}>
            <HeartIcon /> <span className='hidden md:inline'>Favourites</span>
          </Button>
        ) : (
          <Button render={<Link to='/login' />} nativeButton={false}>
            Login
          </Button>
        )}

        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Avatar>
                  <AvatarImage src={session.image} />
                  <AvatarFallback className='uppercase'>{session.fullName.slice(0, 2)}</AvatarFallback>
                </Avatar>
              }
              nativeButton
            />

            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                className='w-full cursor-pointer hover:bg-muted focus:bg-muted'
                render={
                  <button
                    disabled={isPending}
                    onClick={() => {
                      logout(
                        {},
                        {
                          onSuccess: () => {
                            navigate({
                              to: '/',
                            });
                            getContext().queryClient.invalidateQueries();
                          },
                        },
                      );
                    }}
                    type='button'
                  >
                    Logout
                  </button>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
