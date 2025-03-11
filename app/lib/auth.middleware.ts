import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { auth } from './auth.server';

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const request = getWebRequest();

  if (request?.headers) {
    const [response, member] = await Promise.all([
      auth.api.getSession({ headers: request.headers }),
      auth.api.getActiveMember({ headers: request.headers }).catch(() => null),
    ]);

    if (response && member)
      return next({
        context: {
          member,
          api: auth.api,
          user: response.user,
          headers: request.headers,
          session: response.session,
        },
      });
  }

  throw redirect({ to: '/login', replace: true });
});
