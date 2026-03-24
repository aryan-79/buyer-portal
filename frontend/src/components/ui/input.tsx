import { Input as InputPrimitive } from '@base-ui/react/input';
import { EyeClosedIcon, EyeIcon } from '@phosphor-icons/react';
import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot='input'
      className={cn(
        'h-8 w-full min-w-0 rounded-none border border-input bg-transparent px-2.5 py-1 text-xs transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 md:text-xs dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
        className,
      )}
      {...props}
    />
  );
}

function PasswordInput({ className, ...props }: Omit<React.ComponentProps<'input'>, 'type'>) {
  const [isPasswordInput, setIsPasswordInput] = React.useState(true);

  return (
    <div className='w-full relative'>
      <Input {...props} type={isPasswordInput ? 'password' : 'text'} className={cn(className)} />
      <button
        type='button'
        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex shrink-0 items-center justify-center rounded-none h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50"
        onClick={() => setIsPasswordInput(!isPasswordInput)}
      >
        {isPasswordInput ? <EyeClosedIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

export { Input, PasswordInput };
