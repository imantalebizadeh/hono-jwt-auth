import { Hono } from "hono";
import { type JwtVariables } from "hono/jwt";
import { logger } from "hono/logger";

import { authApp } from "@/routes/auth";

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>().basePath("/api");

app.use(logger());

app.route("/", authApp);

export default app;
