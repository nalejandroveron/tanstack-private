import { betterAuth, createMiddleware } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { apiKey, organization } from 'better-auth/plugins';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import * as schema from '../../db/authSchema';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    schema,
    provider: 'pg', // or 'mysql', 'sqlite'
  }),
  databaseHooks: {
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // Cache duration in seconds
      },
      create: {
        before: async (session) => {
          const member = await db
            .select()
            .from(schema.member)
            .where(eq(schema.member.userId, session.userId));

          if (member[0]?.organizationId)
            return {
              data: {
                ...session,
                activeOrganizationId: member[0]?.organizationId,
              },
            };

          return false;
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      //FIXME: Implement Reset Password Email.
      console.log('Reset password Email to: ', user.email);
      console.log('URL: ', url);
      console.log('Token: ', token);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      //FIXME: Implement Verification Email.
      console.log('Verification Email to: ', user.email);
      console.log('URL: ', url);
      console.log('Token: ', token);
    },
  },
  plugins: [
    apiKey(),
    organization({
      // Organization Creation happen on signup automatically.
      allowUserToCreateOrganization: false,
      sendInvitationEmail: async (data) => {
        //FIXME: Implement Invitation Email.
        console.log('Invitation Email data: ', data);
      },
    }),
  ],
});
