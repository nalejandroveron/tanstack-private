import { type } from 'arktype';

export const loginSchema = type({
  email: type('string.email').describe('a valid email'),
  password: type.string.atLeastLength(8).describe('a valid password'),
});

export const forgotPasswordSchema = type({
  email: type('string.email').describe('a valid email'),
});

export const forgotPasswordSetSchema = type({
  password: type.string.atLeastLength(8).describe('a valid password'),
});

export const signupSchema = type({
  userName: type.string.atLeastLength(1).describe('a valid username'),
  userEmail: type('string.email').describe('a valid email'),
  userPassword: type.string.atLeastLength(8).describe('a valid password'),
  organizationName: type.string
    .atLeastLength(1)
    .describe('a valid organization name'),
});

export const acceptInviteSchema = type({
  userName: type.string.atLeastLength(1).describe('a valid username'),
  userPassword: type.string.atLeastLength(8).describe('a valid password'),
});
