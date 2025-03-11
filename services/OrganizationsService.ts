import { type InferSelectModel, sql } from 'drizzle-orm';
import { db } from '../db';
import {
  member,
  organization,
  type user as userSchema,
} from '../db/authSchema';

export const createOrganization = async (
  user: Omit<InferSelectModel<typeof userSchema>, 'image'>,
  organizationName: string,
) => {
  const org = await db
    .insert(organization)
    .values({
      id: sql`gen_random_uuid()`,
      createdAt: sql`now()`,
      name: organizationName,
      slug: `${organizationName.replaceAll(' ', '-').toLowerCase()}-${user.id}`,
    })
    .returning({ id: organization.id });

  await db.insert(member).values({
    id: sql`gen_random_uuid()`,
    organizationId: org[0].id,
    userId: user.id,
    role: 'owner',
    createdAt: sql`now()`,
  });
};
