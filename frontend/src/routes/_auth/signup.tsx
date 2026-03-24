import { createFileRoute } from '@tanstack/react-router';
import SignupPage from '@/components/auth/signup';

export const Route = createFileRoute('/_auth/signup')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignupPage />;
}
