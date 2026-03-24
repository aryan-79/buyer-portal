import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import type { Icon } from '@phosphor-icons/react';

function EmptyBase({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='empty'
      className={cn(
        'flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-none border-dashed p-6 text-center text-balance',
        className,
      )}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot='empty-header' className={cn('flex max-w-sm flex-col items-center gap-2', className)} {...props} />
  );
}

const emptyMediaVariants = cva(
  'mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "flex size-8 shrink-0 items-center justify-center rounded-none bg-muted text-foreground [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function EmptyMedia({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot='empty-icon'
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot='empty-title' className={cn('font-heading text-sm font-medium', className)} {...props} />;
}

function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <div
      data-slot='empty-description'
      className={cn(
        'text-xs/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
        className,
      )}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='empty-content'
      className={cn('flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-xs text-balance', className)}
      {...props}
    />
  );
}

type EmptyProps = React.ComponentProps<'div'> & {
  title: string;
  icon: Icon;
  iconProps?: React.ComponentProps<Icon>;
  description?: string;
};

function Empty({ className, children, title, icon, iconProps, description, ...props }: EmptyProps) {
  const Icon = icon;
  return (
    <EmptyBase className={cn(className)} {...props}>
      <EmptyHeader className='max-w-xl flex-1 w-full'>
        <EmptyMedia variant='icon'>
          <Icon {...iconProps} />
        </EmptyMedia>
        <EmptyTitle className='text-2xl md:text-4xl'>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>

      {children && <EmptyContent className='flex-row justify-center gap-4'>{children}</EmptyContent>}
    </EmptyBase>
  );
}

export { EmptyBase, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia, Empty };
