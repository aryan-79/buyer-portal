import { createFileRoute, redirect } from '@tanstack/react-router';
import AddPropertyForm from '@/components/property/add-property';

export const Route = createFileRoute('/_layout/_admin/admin')({
  beforeLoad: ({ context }) => {
    if (!context.session || context.session.role !== 'admin') {
      throw redirect({
        to: '/',
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='container'>
      <AddPropertyForm />
    </div>
  );
}
