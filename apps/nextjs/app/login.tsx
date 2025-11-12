"use client";
// import { AuthModal } from "@/components/AuthModal";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

import { AuthModal } from "@action-auth/sdk";

export function Login() {
  const [open, setOpen] = useState(false);
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

  const handleApiCall = async () => {
    const token = await authClient.token();
    if (token.data) {
      const jwtToken = token.data.token;
      // console.log("JWT Token:", jwtToken);

      const response = await fetch("/api/protected", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        console.error("API call failed:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log("Protected API response:", data);
    }
  };

  // return (
  //   <div>
  //     <AuthModal open={open} onClose={() => setOpen(false)} />
  //   </div>
  // );

  return (
    <div>
      {user ? (
        <div>Welcome, {user.data?.user.email}</div>
      ) : (
        <div>Please log in</div>
      )}
      <button onClick={handleLogin}>login with google</button>

      <div>
        <button onClick={handleApiCall}> call a nextjs api router</button>
      </div>
      <button onClick={() => setOpen(true)}>Connect wallet</button>
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
