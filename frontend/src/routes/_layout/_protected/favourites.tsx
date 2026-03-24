import PropertyCard, { PropertiesEmpty, PropertyCardSkeleton } from '@/components/property/property-card';
import { fetchGetPropertiesFavourites } from '@/lib/queries/query-components';
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import InfiniteScroll from 'react-infinite-scroll-component';

const favouritesQueryOptions = infiniteQueryOptions({
  queryKey: ['properties', 'favourites'],
  queryFn: async ({ pageParam }) => {
    const data = await fetchGetPropertiesFavourites({
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

export const Route = createFileRoute('/_layout/_protected/favourites')({
  beforeLoad: ({ context }) => {
    console.log('context: ', context);
    console.log('session: ', context.session);
  },
  loader: async ({ context }) => {
    return await context.queryClient.ensureInfiniteQueryData(favouritesQueryOptions);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const loaderData = Route.useLoaderData();
  const { data, fetchNextPage, hasNextPage, isPending } = useInfiniteQuery({
    ...favouritesQueryOptions,
    initialData: loaderData,
  });

  const favourites = data?.pages.flatMap((page) => page.favourites);

  return (
    <div className='container p-0'>
      <InfiniteScroll
        className='p-4'
        dataLength={favourites?.length || 0}
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
        {!favourites || favourites.length === 0 ? (
          !isPending && <PropertiesEmpty isFavourite />
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {favourites?.map((fav) => (
              <PropertyCard property={fav.property} key={fav.id} />
            ))}
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
}
