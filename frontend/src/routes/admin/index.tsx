import { type QueryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { env } from '@/lib/env';

const queryOptions = {
  queryKey: ['test'],
  queryFn: async () => {
    const isServer = typeof window === 'undefined';

    const apiUrl = isServer ? env.API_URL : env.VITE_API_URL;

    const res = await fetch(`${apiUrl}/api/properties`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Failed');
    }

    const data = await res.json();

    console.log('data: ', data);

    return data;
  },
} satisfies QueryOptions;

export const Route = createFileRoute('/admin/')({
  loader: async ({ context }) => {
    const data = context.queryClient.ensureQueryData(queryOptions);

    return data;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(queryOptions);

  return (
    <div>
      Hello "/admin/"!
      <code>
        <pre>{JSON.stringify(data || {}, null, 2)}</pre>
      </code>
    </div>
  );
}
