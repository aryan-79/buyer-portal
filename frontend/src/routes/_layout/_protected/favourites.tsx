import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropertyCard, { PropertiesEmpty, PropertyCardSkeleton } from '@/components/property/property-card';
import { fetchGetPropertiesFavourites } from '@/lib/queries/query-components';

const favouritesQueryOptions = (search?: string) => {
  return infiniteQueryOptions({
    queryKey: ['properties', 'favourites', search],
    queryFn: async ({ pageParam }) => {
      const data = await fetchGetPropertiesFavourites({
        queryParams: {
          page: pageParam,
          limit: 20,
          ...(search ? { search } : {}),
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
};

export const Route = createFileRoute('/_layout/_protected/favourites')({
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    const data = await context.queryClient.ensureInfiniteQueryData(favouritesQueryOptions(deps.search.search));
    return data;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { search } = Route.useSearch();
  const loaderData = Route.useLoaderData();

  const { data, fetchNextPage, hasNextPage, isPending } = useInfiniteQuery({
    ...favouritesQueryOptions(search),
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
