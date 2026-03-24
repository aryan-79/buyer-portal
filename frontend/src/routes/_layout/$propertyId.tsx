import { BathtubIcon, BedIcon, CookingPotIcon, CouchIcon } from '@phosphor-icons/react';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchGetPropertiesByPropertyId } from '@/lib/queries/query-components';

const propertyDetailsOptions = (propertyId: string) =>
  queryOptions({
    queryKey: ['property', propertyId],
    queryFn: async () =>
      fetchGetPropertiesByPropertyId({
        pathParams: {
          propertyId,
        },
      }),
  });

export const Route = createFileRoute('/_layout/$propertyId')({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(propertyDetailsOptions(params.propertyId));
    return data.data;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { propertyId } = Route.useParams();

  const {
    data: { data: property },
  } = useSuspenseQuery(propertyDetailsOptions(propertyId));

  const features = [
    {
      name: 'Bedrooms',
      value: property.bedroom,
      icon: BedIcon,
    },
    {
      name: 'Kitchens',
      value: property.kitchen,
      icon: CookingPotIcon,
    },
    {
      name: 'Living Rooms',
      value: property.livingroom,
      icon: CouchIcon,
    },
    {
      name: 'Bathrooms',
      value: property.bathroom,
      icon: BathtubIcon,
    },
  ];

  return (
    <div className='container p-4 space-y-6'>
      <div className='relative'>
        <img src={property.coverImage} alt={property.title} className='h-[60vh] w-full object-cover' />
        <div className='bg-background p-4 absolute right-4 bottom-4'>
          {property.area && <p className=''>{property.area} sq. ft</p>}
          <p className='text-lg md:text-xl font-semibold'>
            {property.address} {property.country}
          </p>
        </div>
      </div>

      <div className='space-y-6'>
        <div className='space-y-4'>
          <h1 className='text-2xl md:text-5xl'>{property.title}</h1>
          <p className='text-muted-foreground lg:max-w-2/3'>{property.description}</p>
        </div>

        <div className='grid grid-cols-4 divide-x-2'>
          {features.map((feature) => {
            if (!feature.value) {
              return null;
            }

            const Icon = feature.icon;

            return (
              <div key={feature.name} className='p-4 text-center'>
                <p className='text-xl md:text-2xl'>{feature.value}</p>
                <div className='flex gap-1 items-center justify-center text-lg md:text-xl'>
                  <Icon weight='fill' className='text-lg md:text-xl' />
                  <span>{feature.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
