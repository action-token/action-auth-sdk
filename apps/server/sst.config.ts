/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "action-auth-server",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      version: "3.17.10",
    };
  },
  async run() {
    // const BETTER_AUTH_URL =
    //   "https://6pmchmr7hbk3pa67v65zanflre0kaiyo.lambda-url.us-west-2.on.aws"; // Base URL of your app
    const BETTER_AUTH_URL =
      "https://zg5nz4f7pbvxlgeycnuwjpy2cy0bigya.lambda-url.us-east-2.on.aws/";
    const GOOGLE_CLIENT_ID =
      "234736501290-tfmjg2o7rtudogs630fq6ahjfemkkrfk.apps.googleusercontent.com";

    // const bucket = new sst.aws.Bucket("MyBucket");
    const dbUrl = new sst.Secret("TURSO_DATABASE_URL");
    const authToken = new sst.Secret("TURSO_AUTH_TOKEN");
    const googleClientSecret = new sst.Secret("GOOGLE_CLIENT_SECRET");
    const stellarServerSecret = new sst.Secret("STELLAR_SERVER_SECRET");
    const betterAuthSecret = new sst.Secret("BETTER_AUTH_SECRET");

    new sst.aws.Function("Hono", {
      url: {
        cors: {
          allowCredentials: true,
          allowOrigins: [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://10.12.24.55:3000",
            "https://92049f4cfa12.ngrok-free.app",
            "https://ce01979be39f.ngrok-free.app",
            "https://396d7p7k-3000.asse.devtunnels.ms",
          ],
          allowHeaders: ["content-type", "authorization"],
          allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"],
          maxAge: "1 day",
        },
      },
      link: [dbUrl, authToken, googleClientSecret, stellarServerSecret],
      handler: "src/index.handler",
      environment: {
        BETTER_AUTH_SECRET: betterAuthSecret.value,
        BETTER_AUTH_URL,
        TURSO_DATABASE_URL: dbUrl.value,
        TURSO_AUTH_TOKEN: authToken.value,
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: googleClientSecret.value,
        STELLAR_NETWORK: process.env.STELLAR_NETWORK || "TESTNET",
        STELLAR_SERVER_SECRET: stellarServerSecret.value,
        WEB_AUTH_DOMAIN:
          process.env.WEB_AUTH_DOMAIN || new URL(BETTER_AUTH_URL).host,
        HOME_DOMAIN: process.env.HOME_DOMAIN || "localhost",
        EMAIL_DOMAIN_NAME: process.env.EMAIL_DOMAIN_NAME || "stellar.local",
      },
    });
  },
});
