import { type InferInsertModel, and, eq, sql } from 'drizzle-orm';
import { match } from 'ts-pattern';
import { db } from '../db';
import {
  invitation as invitationSchema,
  member,
  type organization as organizationSchema,
  user as userTable,
} from '../db/authSchema';
import { applyOrderDirection } from '../db/orderUtils';

export type ListMembersOrderBy = 'user.name' | 'user.email' | 'member.role';

export const listMembers = async (
  organizationId: string,
  orderBy: ListMembersOrderBy = 'user.name',
  orderByDirection: 'asc' | 'desc' = 'asc',
) => {
  return db
    .select()
    .from(member)
    .where(eq(member.organizationId, organizationId))
    .leftJoin(userTable, eq(member.userId, userTable.id))
    .orderBy(
      match(orderBy)
        .with('user.name', () =>
          applyOrderDirection(userTable.name, orderByDirection),
        )
        .with('user.email', () =>
          applyOrderDirection(userTable.email, orderByDirection),
        )
        .with('member.role', () =>
          applyOrderDirection(member.role, orderByDirection),
        )
        .exhaustive(),
    );
};

export const getMember = async (memberId: string, organizationId: string) => {
  const res = await db
    .select()
    .from(member)
    .where(
      and(eq(member.organizationId, organizationId), eq(member.id, memberId)),
    )
    .leftJoin(userTable, eq(member.userId, userTable.id));

  return res?.[0] || null;
};

export const associateFromInvitation = async (
  user: Omit<InferInsertModel<typeof userTable>, 'image'>,
  organization: InferInsertModel<typeof organizationSchema>,
  invitation: InferInsertModel<typeof invitationSchema>,
) => {
  await db.insert(member).values({
    id: sql`gen_random_uuid()`,
    organizationId: organization.id,
    userId: user.id,
    role: invitation.role || 'member',
    createdAt: sql`now()`,
  });

  await db
    .update(invitationSchema)
    .set({ status: 'accepted' })
    .where(eq(invitationSchema.id, invitation.id));
};
