import { aliasedTable, eq } from 'drizzle-orm';

import { db } from '../db';
import { invitation, organization, user } from '../db/authSchema';

const inviterAlias = aliasedTable(user, 'inviter');

export const getInvitation = async (invitationId: string) => {
  const res = await db
    .select({
      invitation,
      organization,
      inviter: inviterAlias,
    })
    .from(invitation)
    .where(eq(invitation.id, invitationId))
    .leftJoin(inviterAlias, eq(invitation.inviterId, inviterAlias.id))
    .leftJoin(organization, eq(invitation.organizationId, organization.id));

  return res?.[0];
};
