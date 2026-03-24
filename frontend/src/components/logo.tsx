import { HouseLineIcon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn('bg-primary text-primary-foreground grid place-content-center size-10 md:size-16 p-2', className)}
    >
      <HouseLineIcon size={40} weight='duotone' />
    </div>
  );
}
