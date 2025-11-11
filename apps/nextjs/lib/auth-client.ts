import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [jwtClient()],
  baseURL:
    "https://izghhhbd7grhvtqs22umfilgqm0twtjn.lambda-url.us-east-2.on.aws/",
  //you can pass client configuration here
});
