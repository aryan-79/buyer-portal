import { HouseLineIcon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export default function Logo({ className, showName }: { className?: string; showName?: boolean }) {
  return (
    <div className='flex gap-2 items-center'>
      <div
        className={cn('bg-primary text-primary-foreground grid place-content-center size-10 md:size-16 p-2', className)}
      >
        <HouseLineIcon size={40} weight='duotone' />
      </div>

      {showName && <span className='font-bold text-xl md:text-2xl'>Fareal EState</span>}
    </div>
  );
}
