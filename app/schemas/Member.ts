import { type } from 'arktype';

export const inviteMemberSchema = type({
  email: type('string.email').describe('a valid email'),
  role: type('"admin" | "member"'),
});

export const updateMemberSchema = type({
  role: type('"admin" | "member"'),
});
