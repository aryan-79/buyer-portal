import { BathtubIcon, BedIcon, CookingPotIcon, HeartIcon } from '@phosphor-icons/react';
import { Link } from '@tanstack/react-router';
import { defaultMutationOptions } from '@/lib/mutaiton-options';
import {
  type GetPropertiesByPropertyIdResponse,
  useDeletePropertiesFavouritesByPropertyId,
  usePostPropertiesFavouritesByPropertyId,
} from '@/lib/queries/query-components';
import { cn, parsePrice } from '@/lib/utils';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

type PropertyCardProps = {
  property: GetPropertiesByPropertyIdResponse['data'];
};

export default function PropertyCard({ property }: PropertyCardProps) {
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
      icon: BathtubIcon,
    },
    {
      name: 'Bathrooms',
      value: property.bathroom,
      icon: BathtubIcon,
    },
  ];

  return (
    <Card className='rounded-lg pt-0'>
      <div className='relative'>
        <Link to='/properties/$propertyId' params={{ propertyId: property.id }}>
          <img src={property.coverImage} alt={property.title} className='h-48 w-full object-cover' />
        </Link>
        <FavouriteButton
          propertyId={property.id}
          isFavourited={property.isFavourited}
          className='absolute z-10 top-2 right-2'
        />
      </div>

      <Link to='/properties/$propertyId' params={{ propertyId: property.id }}>
        <div className='px-2 space-y-5 @container'>
          <div>
            <h3 className='font-semibold text-muted-foreground md:text-xl lg:text-2xl'>{property.title}</h3>

            <p className='font-bold text-primary md:text-xl lg:text-2xl'>
              {parsePrice(property.price, {
                currency: property.currency,
              })}
            </p>

            <p className='text-muted-foreground text-sm md:text-base capitalize'>
              {[property.address, property.city, property.country].join(', ')}
            </p>
          </div>

          <div className='flex gap-4 items-center flex-wrap'>
            {features.map((feature) => {
              if (!feature.value) {
                return null;
              }

              const Icon = feature.icon;

              return (
                <div className='flex items-center gap-1' key={feature.name}>
                  <Icon size={20} className='text-accent' weight='fill' />
                  <span className='text-primary text-nowrap'>
                    {feature.value} {feature.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Link>
    </Card>
  );
}

function FavouriteButton({
  propertyId,
  isFavourited,
  className,
}: {
  propertyId: string;
  isFavourited: boolean;
  className?: string;
}) {
  const { mutate: addToFavourite, isPending: addingToFavourite } = usePostPropertiesFavouritesByPropertyId(
    defaultMutationOptions([['properties']]),
  );
  const { mutate: removeFromFavourite, isPending: removingFromFavourite } = useDeletePropertiesFavouritesByPropertyId(
    defaultMutationOptions([['properties']]),
  );

  const handleClick = () => {
    if (isFavourited) {
      removeFromFavourite(
        {
          pathParams: {
            propertyId,
          },
        },
        {
          onError: (err) => {
            if (err instanceof Error) {
            } else {
            }
          },
        },
      );
    } else {
      addToFavourite({
        pathParams: {
          propertyId,
        },
      });
    }
  };

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      size='icon'
      variant='secondary'
      className={cn('rounded-full', className)}
      disabled={addingToFavourite || removingFromFavourite}
    >
      <HeartIcon weight={isFavourited ? 'fill' : 'regular'} className={cn(isFavourited && 'fill-pink-700')} />
    </Button>
  );
}

export function PropertyCardSkeleton() {
  return (
    <Card className='rounded-lg pt-0'>
      <div className='relative'>
        <Skeleton className='h-48 w-full' />
      </div>
      <div className='px-2 space-y-5'>
        <div className='space-y-1'>
          <Skeleton className='h-6 w-3/4' />
          <Skeleton className='h-7 w-1/3' />
          <Skeleton className='h-4 w-2/3' />
        </div>
        <div className='flex gap-4 items-center'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-5 w-20' />
          ))}
        </div>
      </div>
    </Card>
  );
}
