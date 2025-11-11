"use client";
import { Button } from "../ui/button";

export function Success({
  message,
  onClose,
}: {
  message: string | null;
  onClose: () => void;
}) {
  return (
    <div className="space-y-3 text-sm text-gray-700">
      <p>{message || "Done. You can close this window."}</p>
      <div className="flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
