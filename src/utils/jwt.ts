import { sign, verify } from "hono/jwt";

// Token expiration time (e.g., 30 days in seconds)
const TOKEN_EXPIRATION = 60 * 60 * 24 * 30;

// Generate a JWT token for a user
export const generateToken = async (
  userId: number,
  email: string,
  secret: string
): Promise<string> => {
  const payload = {
    sub: userId.toString(),
    email,
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION,
  };

  return await sign(payload, secret);
};

// Verify a JWT token
export const verifyToken = async (
  token: string,
  secret: string
): Promise<any> => {
  try {
    return await verify(token, secret);
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};
