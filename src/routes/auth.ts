import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";

import { honoEnv } from "@/env";
import { authenticated } from "@/middlewares/auth";
import { signInSchema, signUpSchema } from "@/schemas/auth";
import {
  createUser,
  findUserByEmail,
  verifyCredentials,
} from "@/services/user";
import { generateToken } from "@/utils/jwt";

export const authApp = new Hono().basePath("/auth");

// Cookie options
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict" as const,
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: "/",
};

// Sign up route
authApp.post("/sign-up", zValidator("json", signUpSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  // Check if user already exists
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    throw new HTTPException(409, {
      message: "User already exists",
    });
  }

  // Create new user
  const user = await createUser(email, password);
  if (!user) {
    throw new HTTPException(500, {
      message: "Failed to create user",
    });
  }

  // Generate JWT token
  const { SECRET_KEY } = honoEnv(c);
  const token = await generateToken(user.id, user.email, SECRET_KEY);

  // Set token in cookie
  setCookie(c, "auth_token", token, COOKIE_OPTIONS);

  return c.json(
    {
      message: "User created successfully",
      user: { id: user.id, email: user.email },
    },
    201
  );
});

// Sign in route
authApp.post("/sign-in", zValidator("json", signInSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  // Verify credentials
  const user = await verifyCredentials(email, password);
  if (!user) {
    throw new HTTPException(401, {
      message: "Invalid credentials",
    });
  }

  // Generate JWT token
  const { SECRET_KEY } = honoEnv(c);
  const token = await generateToken(user.id, user.email, SECRET_KEY);

  // Set token in cookie
  setCookie(c, "auth_token", token, COOKIE_OPTIONS);

  return c.json({
    message: "Authentication successful",
    user: { id: user.id, email: user.email },
  });
});

// Sign out route
authApp.post("/sign-out", (c) => {
  // Delete the auth cookie
  deleteCookie(c, "auth_token", COOKIE_OPTIONS);

  return c.json({ message: "Logged out successfully" });
});

// Get current user route (protected)
authApp.get("/user", authenticated, (c) => {
  // User data is available from the JWT payload
  const payload = c.get("jwtPayload");

  return c.json({
    user: {
      id: payload.sub,
      email: payload.email,
    },
  });
});
