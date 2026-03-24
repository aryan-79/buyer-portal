import { createFileRoute } from '@tanstack/react-router';
import { fetchGetProperties } from '@/lib/queries/query-components';
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropertyCard, { PropertiesEmpty, PropertyCardSkeleton } from '@/components/property/property-card';

const propertiesQueryOptions = infiniteQueryOptions({
  queryKey: ['properties'],
  queryFn: async ({ pageParam }) => {
    const data = await fetchGetProperties({
      queryParams: {
        page: pageParam,
        limit: 20,
      },
    });

    return data.data;
  },
  initialPageParam: 1,
  getNextPageParam: (last) => {
    if (last.page < last.totalPages) {
      return last.page + 1;
    }
  },
});

export const Route = createFileRoute('/_layout/')({
  loader: async ({ context }) => {
    return await context.queryClient.ensureInfiniteQueryData(propertiesQueryOptions);
  },
  component: Component,
});

function Component() {
  const loaderData = Route.useLoaderData();
  const { data, fetchNextPage, hasNextPage, isPending } = useInfiniteQuery({
    ...propertiesQueryOptions,
    initialData: loaderData,
  });

  const properties = data?.pages.flatMap((page) => page.properties);

  return (
    <div className='container p-0'>
      <InfiniteScroll
        className='p-4'
        dataLength={properties?.length || 0}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {Array.from({ length: 4 }).map((_, index) => {
              return <PropertyCardSkeleton key={index} />;
            })}
          </div>
        }
      >
        {!properties || properties.length === 0 ? (
          !isPending && <PropertiesEmpty />
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {properties.map((property) => (
              <PropertyCard property={property} key={property.id} />
            ))}
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
}
