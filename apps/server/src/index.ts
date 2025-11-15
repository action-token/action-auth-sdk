import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { auth } from "./auth";
import { cors } from "hono/cors";
import adminRoutes from "./routes/admin";
import { validateOrigin } from "./middleware/cors";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: validateOrigin,
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
    maxAge: 86400, // 1 day
    exposeHeaders: ["Content-Length", "X-Request-Id"],
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

// Admin routes
app.route("/api/admin", adminRoutes);

export const handler = handle(app);
