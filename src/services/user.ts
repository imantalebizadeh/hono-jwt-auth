import { db } from "@/db";

export interface User {
  id: number;
  email: string;
  password: string;
}

// Find a user by email
export const findUserByEmail = (email: string): User | undefined => {
  return db.query("SELECT * FROM users WHERE email = ?").get(email) as
    | User
    | undefined;
};

// Create a new user
export const createUser = async (
  email: string,
  password: string
): Promise<User | undefined> => {
  const hashedPassword = await Bun.password.hash(password);

  try {
    db.run("INSERT INTO users (email, password) VALUES (?, ?)", [
      email,
      hashedPassword,
    ]);
    return findUserByEmail(email);
  } catch (error) {
    console.error("Failed to create user:", error);
    return undefined;
  }
};

// Verify user credentials
export const verifyCredentials = async (
  email: string,
  password: string
): Promise<User | undefined> => {
  const user = db.query("SELECT * FROM users WHERE email = ?").get(email) as
    | User
    | undefined;

  if (!user) {
    return undefined;
  }

  if (await Bun.password.verify(password, user.password)) {
    return user;
  }

  return undefined;
};
