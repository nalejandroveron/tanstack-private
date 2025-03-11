import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { type } from 'arktype';
import { getInvitation } from '../../../services/InvitationsService';
import { associateFromInvitation } from '../../../services/MembersService';
import { AcceptInvitation } from '../../components/AcceptInvitation';
import { auth } from '../../lib/auth.server';
import useMutation from '../../lib/useMutation';
import { acceptInviteSchema } from '../../schemas/Auth';

const invitationData = createServerFn({ method: 'GET' })
  .validator(type({ id: type.string }))
  .handler(async ({ data }) => {
    const invitation = await getInvitation(data.id);

    if (
      invitation?.inviter &&
      invitation.organization &&
      invitation.invitation.status === 'pending'
    )
      return {
        inviterName: invitation.inviter.name,
        organizationName: invitation.organization.name,
      };

    throw redirect({ to: '/login', search: { state: 'UNKNOWN_INVITE' } });
  });

const acceptInvitation = createServerFn({ method: 'POST' })
  .validator(type({ id: type.string, values: acceptInviteSchema }))
  .handler(async ({ data }) => {
    const invitationData = await getInvitation(data.id);

    if (invitationData.inviter && invitationData.organization) {
      const { user } = await auth.api.signUpEmail({
        body: {
          name: data.values.userName,
          email: invitationData.invitation.email,
          password: data.values.userPassword,
        },
      });

      await associateFromInvitation(
        user,
        invitationData.organization,
        invitationData.invitation,
      );

      return { error: false };
    }

    return { error: true };
  });

export const Route = createFileRoute('/invitation/$invitationId')({
  component: RouteComponent,
  loader: ({ params }) => invitationData({ data: { id: params.invitationId } }),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { invitationId } = Route.useParams();
  const invitation = Route.useLoaderData();
  const [, mutate] = useMutation((values: typeof acceptInviteSchema.infer) =>
    acceptInvitation({
      data: { id: invitationId, values },
    }),
  );

  return (
    <AcceptInvitation
      invitation={invitation}
      onSubmit={async (values) => {
        const { error } = await mutate(values);
        navigate({
          to: '/login',
          search: { state: error ? 'UNKNOWN_INVITE' : 'INVITATION_SUCCESS' },
        });
      }}
    />
  );
}
