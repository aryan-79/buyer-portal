import { fetchGetProperties } from '@/lib/queries/query-components';
import { type QueryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

const queryOptions = {
  queryKey: ['properties'],
  queryFn: async () => {
    const { data } = await fetchGetProperties({});
    return data;
  },
} satisfies QueryOptions;

export const Route = createFileRoute('/admin/')({
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(queryOptions);

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
