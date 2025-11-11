"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { TextInput } from "./ui";

export function ResetPassword({
  authClient,
  setView,
  setError,
  setMessage,
  resetToken,
}: {
  authClient: any;
  setView: (view: "login" | "signup" | "forgot" | "reset" | "success") => void;
  setError: (error: string | null) => void;
  setMessage: (message: string | null) => void;
  resetToken: string;
}) {
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  async function handleResetPassword() {
    if (!resetToken) {
      setError("Missing or invalid reset token.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await authClient.resetPassword({ newPassword, token: resetToken });
      setMessage("Password has been reset. You can now sign in.");
      setView("login");
    } catch (e: any) {
      setError(e?.message ?? "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        handleResetPassword();
      }}
    >
      <TextInput
        label="New Password"
        type="password"
        value={newPassword}
        onChange={setNewPassword}
        required
      />
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Reset password"}
        </Button>
      </div>
    </form>
  );
}
