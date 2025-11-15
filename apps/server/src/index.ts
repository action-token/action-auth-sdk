import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { auth } from "./auth";
import { cors } from "hono/cors";
// import auth from "./routes/auth";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: (origin) => {
      // Allow all localhost ports for development
      if (
        origin?.startsWith("http://localhost:") ||
        origin?.startsWith("http://127.0.0.1:")
      ) {
        return origin;
      }

      // Allowed production/staging origins
      const allowedOrigins = [
        "https://action-auth-sdk-nextjs.vercel.app",
        "https://92049f4cfa12.ngrok-free.app",
        "https://ce01979be39f.ngrok-free.app",
        "https://396d7p7k-3000.asse.devtunnels.ms",
      ];

      // Allow all Vercel preview deployments
      if (origin?.endsWith(".vercel.app")) {
        return origin;
      }

      // Check if origin is in allowed list
      if (origin && allowedOrigins.includes(origin)) {
        return origin;
      }

      // Default: return the origin (or return false to block)
      return origin || "*";
    },
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
    maxAge: 86400, // 1 day
    exposeHeaders: ["Content-Length", "X-Request-Id"],
  })
);

// CORS is handled by the AWS Lambda Function URL configuration in sst.config.ts

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

export const handler = handle(app);
