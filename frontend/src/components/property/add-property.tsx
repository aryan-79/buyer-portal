import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod/v4';
import { getContext } from '@/integrations/tanstack-query/provider';
import { usePostProperties } from '@/lib/queries/query-components';
import { Button } from '../ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const currencySchema = z.enum(['NPR', 'USD', 'INR', 'EUR']);

const propertyBaseSchema = z.object({
  title: z.string({ error: 'Title is required' }).min(3).max(255),
  description: z.string({ error: 'Description is required' }).min(10),
  price: z.coerce.number().refine((val) => /^\d+(\.\d{1,2})?$/.test(String(val)), {
    error: 'Invalid price',
  }),
  currency: currencySchema,
  area: z.coerce
    .number()
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(String(val)), {
      error: 'Invalid area',
    })
    .optional(),
  address: z.string({ error: 'Address is required' }).min(3),
  city: z.string({ error: 'City is required' }).min(2),
  country: z.string({ error: 'Country is required' }).min(2),
  bedroom: z.number({ error: 'Bedroom count is required' }).int().min(0).default(0),
  kitchen: z.number({ error: 'Kitchen count is required' }).int().min(0).default(0),
  bathroom: z.number({ error: 'Bathroom count is required' }).int().min(0).default(0),
  livingroom: z.number({ error: 'Living room count is required' }).int().min(0).default(0),
  coverImage: z.url({ error: 'Cover image for property is required' }),
  images: z.array(z.url()).optional(),
});

type PropertyFormValues = z.infer<typeof propertyBaseSchema>;

const currencyOptions: { label: string; value: PropertyFormValues['currency'] }[] = [
  {
    label: 'Nepalese Rupees',
    value: 'NPR',
  },
  {
    label: 'US Dollar',
    value: 'USD',
  },
  {
    label: 'Indian Rupees',
    value: 'INR',
  },
  {
    label: 'Euro',
    value: 'EUR',
  },
];

export default function AddPropertyForm() {
  const form = useForm<PropertyFormValues>({
    mode: 'onChange',
    resolver: standardSchemaResolver(propertyBaseSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      currency: 'NPR',
      address: '',
      city: '',
      country: '',
      bedroom: 0,
      kitchen: 0,
      bathroom: 0,
      livingroom: 0,
      coverImage: '',
      images: [],
    },
  });

  const { mutate: addProperty, isPending } = usePostProperties({
    onSuccess: (data) => {
      toast.success(data.message);
      getContext().queryClient.invalidateQueries({
        queryKey: ['properties'],
      });
      form.reset();
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Failed to add property');
      }
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => {
        addProperty({
          body: values,
        });
      })}
      className='space-y-6'
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name='title'
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className='uppercase'>
                Title
              </FieldLabel>
              <Input {...field} placeholder='Enter property title' />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name='description'
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className='uppercase'>
                Description
              </FieldLabel>
              <Input {...field} placeholder='Enter property description' />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FieldGroup>
          <Controller
            control={form.control}
            name='price'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className='uppercase'>
                  Price
                </FieldLabel>
                <Input {...field} type='number' placeholder='Enter price' />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            control={form.control}
            name='currency'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className='uppercase'>
                  Currency
                </FieldLabel>
                <Select items={currencyOptions}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select currency' />
                  </SelectTrigger>

                  <SelectContent>
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <FieldGroup>
        <Controller
          control={form.control}
          name='area'
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className='uppercase'>
                Area (sq.ft)
              </FieldLabel>
              <Input {...field} type='number' placeholder='Enter area (optional)' />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          control={form.control}
          name='address'
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className='uppercase'>
                Address
              </FieldLabel>
              <Input {...field} placeholder='Enter address' />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <FieldGroup>
          <Controller
            control={form.control}
            name='city'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className='uppercase'>
                  City
                </FieldLabel>
                <Input {...field} placeholder='Enter city' />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            control={form.control}
            name='country'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className='uppercase'>
                  Country
                </FieldLabel>
                <Input {...field} placeholder='Enter country' />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            control={form.control}
            name='bedroom'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className='uppercase'>
                  Bedrooms
                </FieldLabel>
                <Input
                  {...field}
                  type='number'
                  placeholder='Enter bedroom count'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <FieldGroup>
          <Controller
            control={form.control}
            name='kitchen'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className='uppercase'>
                  Kitchens
                </FieldLabel>
                <Input
                  {...field}
                  type='number'
                  placeholder='Enter kitchen count'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            control={form.control}
            name='bathroom'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className='uppercase'>
                  Bathrooms
                </FieldLabel>
                <Input
                  {...field}
                  type='number'
                  placeholder='Enter bathroom count'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            control={form.control}
            name='livingroom'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className='uppercase'>
                  Living Rooms
                </FieldLabel>
                <Input
                  {...field}
                  type='number'
                  placeholder='Enter living room count'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <FieldGroup>
        <Controller
          control={form.control}
          name='coverImage'
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className='uppercase'>
                Cover Image URL
              </FieldLabel>
              <Input {...field} placeholder='https://example.com/image.jpg' />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type='submit' className='w-full' size='lg' disabled={isPending}>
        {isPending ? 'Adding Property...' : 'Add Property'}
      </Button>
    </form>
  );
}
