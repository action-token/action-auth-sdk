"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Shield, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authenticatedFetch } from "@/lib/admin-api";

interface Admin {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: "", role: "admin" });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await authenticatedFetch("/api/admin/admins");
      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins);
      }
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async () => {
    if (!newAdmin.email) {
      alert("Email is required");
      return;
    }

    try {
      const response = await authenticatedFetch("/api/admin/admins", {
        method: "POST",
        body: JSON.stringify(newAdmin),
      });

      if (response.ok) {
        setShowDialog(false);
        setNewAdmin({ email: "", role: "admin" });
        fetchAdmins();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add admin");
      }
    } catch (error) {
      console.error("Failed to add admin:", error);
      alert("Failed to add admin");
    }
  };

  const deleteAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to remove this admin?")) return;

    try {
      const response = await authenticatedFetch(`/api/admin/admins/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAdmins();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete admin");
      }
    } catch (error) {
      console.error("Failed to delete admin:", error);
      alert("Failed to delete admin");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold">Admin Users</h1>
            <p className="text-muted-foreground mt-2">
              Manage admin access to the dashboard
            </p>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogDescription>
                  Grant admin access to a user (they must be registered first)
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, email: e.target.value })
                    }
                    placeholder="admin@example.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    User must already have an account
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={newAdmin.role}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, role: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Super admins can add/remove other admins
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={addAdmin}>Add Admin</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div>Loading admins...</div>
        ) : (
          <div className="grid gap-4">
            {admins.map((admin) => (
              <Card key={admin.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-3">
                    {admin.role === "super_admin" ? (
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    ) : (
                      <Shield className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{admin.email}</CardTitle>
                      <Badge
                        variant={
                          admin.role === "super_admin" ? "default" : "secondary"
                        }
                        className="mt-1"
                      >
                        {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteAdmin(admin.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
