"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { TextInput } from "./ui";

export function SignIn({
  authClient,
  setView,
  setError,
  setMessage,
}: {
  authClient: any;
  setView: (view: "login" | "signup" | "forgot" | "reset" | "success") => void;
  setError: (error: string | null) => void;
  setMessage: (message: string | null) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setLocalError] = useState<string | null>(null);

  async function handleSignIn() {
    setLoading(true);
    setError(null);
    setLocalError(null);
    setMessage(null);
    try {
      await authClient.signIn.email(
        { email, password, rememberMe },
        {
          onSuccess: () => {
            setMessage("Signed in successfully.");
            setView("success");
          },
          onError: async (ctx: any) => {
            if (ctx.error?.status === 403) {
              setLocalError(
                "Please verify your email address. We can resend the verification link."
              );
            } else {
              setError(ctx.error?.message ?? "Failed to sign in");
            }
          },
        }
      );
    } catch (e: any) {
      setError(e?.message ?? "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }

  async function resendVerification() {
    setLoading(true);
    setError(null);
    setLocalError(null);
    setMessage(null);
    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: window.location.origin,
      });
      setMessage("Verification email sent. Check your inbox.");
    } catch (e: any) {
      setError(e?.message ?? "Failed to send verification email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        handleSignIn();
      }}
    >
      <TextInput
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        required
      />
      <TextInput
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        required
      />
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          className="size-4"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        Remember me
      </label>

      {error && (
        <div className="flex items-center justify-between text-sm text-gray-700">
          <p className="text-red-700">{error}</p>
          <button
            type="button"
            className="underline"
            onClick={resendVerification}
            disabled={loading}
          >
            Resend verification email
          </button>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          className="text-sm underline"
          onClick={() => setView("forgot")}
        >
          Forgot password?
        </button>
        <Button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </div>
    </form>
  );
}
