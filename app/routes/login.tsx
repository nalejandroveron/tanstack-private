import { createFileRoute } from '@tanstack/react-router';
import { type } from 'arktype';
import { P, match } from 'ts-pattern';
import { Login } from '../components/Login';
import { authClient } from '../lib/auth.client';
import useMutation from '../lib/useMutation';
import type { loginSchema } from '../schemas/Auth';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  validateSearch: type({
    'state?': type(
      '"SIGNUP_OK" | "UNKNOWN_INVITE" | "INVITATION_SUCCESS" | "UNKNOWN_RESET_PASSWORD"',
    ),
  }),
});

const states = {
  SIGNUP_OK: 'Account Created Successfully, check your email to validate.',
  INVITATION_SUCCESS:
    'Invitation Accepted Successfully, check your email to validate.',
  UNKNOWN_INVITE: 'Unknown Invitation link.',
  UNKNOWN_RESET_PASSWORD: 'Unknown Reset Password link.',
};

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [state, mutate] = useMutation((value: typeof loginSchema.infer) =>
    authClient.signIn.email({
      email: value.email,
      password: value.password,
    }),
  );

  const message = match(state?.value?.error || search)
    .with({ state: 'SIGNUP_OK' }, () => ({
      messageType: 'info' as const,
      message: states.SIGNUP_OK,
    }))
    .with({ state: 'UNKNOWN_INVITE' }, () => ({
      messageType: 'error' as const,
      message: states.UNKNOWN_INVITE,
    }))
    .with({ message: P.string }, ({ message }) => ({
      messageType: 'error' as const,
      message,
    }))
    .otherwise(() => undefined);

  return (
    <Login
      message={message}
      onSubmit={async (values) => {
        await mutate(values);
        navigate({ to: '/' });
      }}
    />
  );
}
