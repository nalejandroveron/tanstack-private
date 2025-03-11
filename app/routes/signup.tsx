import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { createOrganization } from '../../services/OrganizationsService';
import { Signup } from '../components/Signup';
import { auth } from '../lib/auth.server';
import { signupSchema } from '../schemas/Auth';

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
});

const signup = createServerFn({
  method: 'POST',
})
  .validator(signupSchema)
  .handler(async ({ data }) => {
    const { user } = await auth.api.signUpEmail({
      body: {
        name: data.userName,
        email: data.userEmail,
        password: data.userPassword,
      },
    });

    await createOrganization(user, data.organizationName);
  });

function RouteComponent() {
  const navigate = Route.useNavigate();

  return (
    <Signup
      onSubmit={async (values) => {
        await signup({ data: values });
        navigate({ to: '/login', search: { state: 'SIGNUP_OK' } });
      }}
    />
  );
}
