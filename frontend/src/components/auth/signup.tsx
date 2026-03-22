import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Link, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod/v4';
import propertyImage from '@/assets/real-estate.jpg';
import { usePostAuthSignup } from '@/lib/queries/query-components';
import Logo from '../logo';
import { Button } from '../ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input, PasswordInput } from '../ui/input';

export default function SignupPage() {
  return (
    <div className='flex-1 flex items-center'>
      <div className='grid gap-4 md:grid-cols-2 container w-full'>
        <div className='relative hidden md:block h-[80vh] my-auto'>
          <img src={propertyImage} alt='Property Image' className='absolute inset-0 size-full object-cover' />
          <div className='absolute inset-0 size-full bg-linear-to-b from-primary/40 via-primary/70 to-primary opacity-80 z-10' />
        </div>

        <div className='p-6 flex flex-col justify-center gap-8'>
          <div className='flex gap-4 items-center'>
            <Logo />
            <h1 className='font-bold text-3xl md:text-5xl'>Fareal EState</h1>
          </div>

          <div className='space-y-6'>
            <div className='space-y-2'>
              <h2 className='font-semibold text-4xl md:text-6xl'>Create Account</h2>
              <p className='text-muted-foreground text-xl md:text-2xl leading-tight'>
                Fill the details below to create your account.
              </p>
            </div>

            <div className='space-y-6'>
              <SignupForm />

              <p className='text-center'>
                Already have an account?{' '}
                <Link to='/login' className='text-accent'>
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.email({ error: 'Invalid email' }),
    password: z.string().min(8, 'Password length must be at least 8 characters long'),
    confirmPassword: z.string(),
  })
  .refine((ctx) => ctx.password === ctx.confirmPassword, {
    error: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupValues = z.infer<typeof signupSchema>;

function SignupForm() {
  const form = useForm<SignupValues>({
    mode: 'onChange',
    resolver: standardSchemaResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const navigate = useNavigate();

  const { mutate: signup, isPending } = usePostAuthSignup({
    onSuccess: (data) => {
      toast.success(data.message);
      navigate({
        to: '/login',
      });
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(err.payload.message);
      }
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(({ confirmPassword: _, ...values }) => {
        signup({
          body: values,
        });
      })}
      className='space-y-4'
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name='fullName'
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className='uppercase'>
                  Full Name
                </FieldLabel>

                <Input {...field} placeholder='John Doe' />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name='email'
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className='uppercase'>
                  Email Address
                </FieldLabel>

                <Input {...field} placeholder='johndoe@gmail.com' />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name='password'
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className='uppercase'>
                  Password
                </FieldLabel>

                <PasswordInput {...field} placeholder='Enter your password' />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name='confirmPassword'
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className='uppercase'>
                  Confirm Password
                </FieldLabel>

                <PasswordInput {...field} placeholder='Re-enter your password' />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <Button type='submit' className='w-full' size='lg' disabled={isPending}>
        Login
      </Button>
    </form>
  );
}
