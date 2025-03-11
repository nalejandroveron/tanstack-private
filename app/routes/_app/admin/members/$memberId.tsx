import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { type } from 'arktype';
import { getMember, listMembers } from '../../../../../services/MembersService';
import { MembersTable } from '../../../../components/MembersTable';
import { UpdateMemberDrawer } from '../../../../components/UpdateMemberDrawer';
import { PageHeading } from '../../../../components/ui/PageHeading';
import { authClient } from '../../../../lib/auth.client';
import { authMiddleware } from '../../../../lib/auth.middleware';

const userDetails = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(type({ id: type.string }))
  .handler(async ({ data, context }) => {
    const [users, user] = await Promise.all([
      listMembers(context.member.organizationId),
      getMember(data.id, context.member.organizationId),
    ]);

    return { users, user };
  });

export const Route = createFileRoute('/_app/admin/members/$memberId')({
  component: RouteComponent,
  loader: ({ params }) => userDetails({ data: { id: params.memberId } }),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { users, user } = Route.useLoaderData();

  return (
    <PageHeading title="Users">
      <UpdateMemberDrawer
        member={user}
        onClose={() => navigate({ to: '/admin/members' })}
        onUpdate={async (data) => {
          await authClient.organization.updateMemberRole({
            memberId: user.member.id,
            role: data.role,
          });

          navigate({ to: '/admin/members' });
        }}
        onRemove={async () => {
          await authClient.organization.removeMember({
            memberIdOrEmail: user.member.id,
          });

          navigate({ to: '/admin/members' });
        }}
      />
      <MembersTable data={users} />
    </PageHeading>
  );
}
