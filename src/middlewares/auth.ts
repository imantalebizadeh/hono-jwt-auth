import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";

import { honoEnv } from "@/env";

export const authenticated = createMiddleware(async (c, next) => {
  const { SECRET_KEY } = honoEnv(c);

  // Check for JWT token in cookies first
  const tokenFromCookie = getCookie(c, "auth_token");

  if (tokenFromCookie) {
    // If token exists in cookie, attach it to Authorization header
    c.req.raw.headers.set("Authorization", `Bearer ${tokenFromCookie}`);
  }

  // Use JWT middleware for validation
  const middleware = jwt({
    secret: SECRET_KEY,
  });

  return middleware(c, next);
});
