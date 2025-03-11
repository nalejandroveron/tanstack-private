import { Link, createFileRoute } from '@tanstack/react-router';
import { ForgotPassword } from '../../components/ForgotPassword';
import { Alert } from '../../components/ui/Alerts';
import { authClient } from '../../lib/auth.client';
import useMutation from '../../lib/useMutation';
import type { forgotPasswordSchema } from '../../schemas/Auth';

export const Route = createFileRoute('/forgot-password/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [state, mutate] = useMutation(
    (value: typeof forgotPasswordSchema.infer) =>
      authClient.forgetPassword({
        email: value.email,
        redirectTo: '/forgot-password/set',
      }),
  );

  const hasMessage = state.value?.error?.message || state.value?.data?.status;

  const message = hasMessage
    ? {
        message:
          state.value?.error?.message ||
          'Check your email for further instructions.',
        messageType: state.value?.error?.message
          ? ('error' as const)
          : ('info' as const),
      }
    : undefined;

  return (
    <ForgotPassword message={message} onSubmit={(values) => mutate(values)} />
  );
}
