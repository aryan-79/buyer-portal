import { createFileRoute, Outlet } from '@tanstack/react-router';
import Navbar from '@/components/navbar';
import { searchSchema } from '@/lib/schema';

export const Route = createFileRoute('/_layout')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
