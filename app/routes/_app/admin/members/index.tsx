import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { listMembers } from '../../../../../services/MembersService';
import { MembersTable } from '../../../../components/MembersTable';
import { ButtonLink } from '../../../../components/ui/ButtonLink';
import { PageHeading } from '../../../../components/ui/PageHeading';
import { authMiddleware } from '../../../../lib/auth.middleware';

const userDetails = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listMembers(context.member.organizationId));

export const Route = createFileRoute('/_app/admin/members/')({
  component: RouteComponent,
  loader: () => userDetails(),
});

function RouteComponent() {
  const users = Route.useLoaderData();

  return (
    <PageHeading
      title="Members"
      actions={
        <ButtonLink
          kind="primary"
          to="/admin/members/invite"
          label="Add Member"
        />
      }
    >
      <MembersTable data={users} />
    </PageHeading>
  );
}
