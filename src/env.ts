import type { Context } from "hono";
import { env } from "hono/adapter";

type Env = {
  SECRET_KEY: string;
};

export const honoEnv = (c: Context) => env<Env>(c);
