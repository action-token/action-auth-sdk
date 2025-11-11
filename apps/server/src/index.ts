import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { auth } from "./auth";
// import auth from "./routes/auth";

const app = new Hono();

// CORS is handled by the AWS Lambda Function URL configuration in sst.config.ts

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

export const handler = handle(app);
