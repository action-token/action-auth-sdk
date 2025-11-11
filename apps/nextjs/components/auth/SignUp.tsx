"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { TextInput } from "./ui";

export function SignUp({
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignUp() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await authClient.signUp.email({ name, email, password });
      setMessage(
        "Account created. Please check your email to verify your account."
      );
      setView("success");
    } catch (e: any) {
      setError(e?.message ?? "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        handleSignUp();
      }}
    >
      <TextInput label="Name" value={name} onChange={setName} required />
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

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </Button>
      </div>
    </form>
  );
}
