import { createFileRoute, redirect } from '@tanstack/react-router';
import { type } from 'arktype';
import { ForgotPasswordSet } from '../../components/ForgotPasswordSet';
import { authClient } from '../../lib/auth.client';
import useMutation from '../../lib/useMutation';
import type { forgotPasswordSetSchema } from '../../schemas/Auth';

export const Route = createFileRoute('/forgot-password/set')({
  component: RouteComponent,
  validateSearch: type({
    token: type.string.optional(),
    error: type.string.optional(),
  }),
  loaderDeps: ({ search }) => ({
    error: search.error,
    token: search.token,
  }),
  loader: async ({ deps }) => {
    if (deps.error || !deps.token)
      throw redirect({
        to: '/login',
        search: { state: 'UNKNOWN_RESET_PASSWORD' },
      });

    return deps.token;
  },
});

function RouteComponent() {
  const token = Route.useLoaderData();

  const [state, mutate] = useMutation(
    (value: typeof forgotPasswordSetSchema.infer) =>
      authClient.resetPassword({
        token,
        newPassword: value.password,
      }),
  );

  const message = state.value?.error?.message
    ? { message: state.value.error.message, messageType: 'error' as const }
    : undefined;

  return (
    <ForgotPasswordSet
      message={message}
      onSubmit={(values) => mutate(values)}
    />
  );
}
