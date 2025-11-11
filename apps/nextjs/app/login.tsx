"use client";
import { authClient } from "@/lib/auth-client";

export function Login() {
  const user = authClient.useSession();
  const handleLogin = () =>
    authClient.signIn
      .social({
        provider: "google",
        callbackURL: "http://localhost:3000",
      })
      .then((result) => {
        console.log("Login result:", result);
      })
      .catch((error) => {
        console.error("Login error:", error);
      });

  const handleApiCall = () => {
    const token = authClient.token().then((token) => {
      if (token.data) {
        const jwtToken = token.data.token;
        console.log("JWT Token:", jwtToken);

        fetch("/api/protected", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
          .then(async (response) => {
            if (!response.ok) {
              console.error("API call failed:", response.statusText);
              return;
            }
          })
          .catch(console.error);
      }
    });
  };

  return (
    <div>
      {user ? (
        <div>Welcome, {user.data?.user.email}</div>
      ) : (
        <div>Please log in</div>
      )}
      <button onClick={handleLogin}>login with google</button>

      <button onClick={handleApiCall}> call a nextjs api router</button>
    </div>
  );
}
