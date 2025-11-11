"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { TextInput } from "./ui";

export function ForgotPassword({
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

  async function handleForgotPassword() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}?callback=/login`,
      });
      setMessage(
        "If an account exists for this email, a reset link has been sent."
      );
      setView("success");
    } catch (e: any) {
      setError(e?.message ?? "Failed to request password reset");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        handleForgotPassword();
      }}
    >
      <TextInput
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        required
      />
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </Button>
      </div>
    </form>
  );
}
