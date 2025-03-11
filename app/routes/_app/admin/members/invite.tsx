import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { listMembers } from '../../../../../services/MembersService';
import { InviteMemberDrawer } from '../../../../components/InviteMemberDrawer';
import { MembersTable } from '../../../../components/MembersTable';
import { PageHeading } from '../../../../components/ui/PageHeading';
import { authClient } from '../../../../lib/auth.client';
import { authMiddleware } from '../../../../lib/auth.middleware';

export const Route = createFileRoute('/_app/admin/members/invite')({
  component: RouteComponent,
  loader: () => userDetails(),
});

const userDetails = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listMembers(context.member.organizationId));

function RouteComponent() {
  const users = Route.useLoaderData();
  const navigate = Route.useNavigate();

  return (
    <PageHeading title="Users">
      <MembersTable data={users} />
      <InviteMemberDrawer
        onClose={() => navigate({ to: '/admin/members' })}
        onInvite={(data) =>
          authClient.organization
            .inviteMember(data)
            .then(() => navigate({ to: '/admin/members' }))
        }
      />
    </PageHeading>
  );
}
