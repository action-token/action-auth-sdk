"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
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

interface Project {
  id: string;
  name: string;
  ownerEmail: string | null;
  status: string;
  createdAt: Date;
}

interface Origin {
  id: number;
  origin: string;
  environment: string;
  isActive: boolean;
  createdAt: Date;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [origins, setOrigins] = useState<Origin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [newOrigin, setNewOrigin] = useState({
    origin: "",
    environment: "production",
  });

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await authenticatedFetch(
        `/api/admin/projects/${projectId}`
      );
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
        setOrigins(data.origins);
      }
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
    }
  };

  const addOrigin = async () => {
    if (!newOrigin.origin) {
      alert("Origin URL is required");
      return;
    }

    try {
      const response = await authenticatedFetch("/api/admin/origins", {
        method: "POST",
        body: JSON.stringify({
          projectId,
          ...newOrigin,
        }),
      });

      if (response.ok) {
        setShowDialog(false);
        setNewOrigin({ origin: "", environment: "production" });
        fetchProject();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add origin");
      }
    } catch (error) {
      console.error("Failed to add origin:", error);
      alert("Failed to add origin");
    }
  };

  const toggleOrigin = async (id: number, currentStatus: boolean) => {
    try {
      const response = await authenticatedFetch(`/api/admin/origins/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchProject();
      }
    } catch (error) {
      console.error("Failed to toggle origin:", error);
    }
  };

  const deleteOrigin = async (id: number) => {
    if (!confirm("Are you sure you want to delete this origin?")) return;

    try {
      const response = await authenticatedFetch(`/api/admin/origins/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProject();
      }
    } catch (error) {
      console.error("Failed to delete origin:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground mt-2">
              {project.ownerEmail || "No owner email"}
            </p>
          </div>
          <Badge
            variant={project.status === "active" ? "default" : "secondary"}
          >
            {project.status}
          </Badge>
        </div>

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Allowed Origins</CardTitle>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Origin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Origin</DialogTitle>
                  <DialogDescription>
                    Add a new allowed origin for this project
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="origin">Origin URL *</Label>
                    <Input
                      id="origin"
                      value={newOrigin.origin}
                      onChange={(e) =>
                        setNewOrigin({ ...newOrigin, origin: e.target.value })
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="environment">Environment</Label>
                    <select
                      id="environment"
                      value={newOrigin.environment}
                      onChange={(e) =>
                        setNewOrigin({
                          ...newOrigin,
                          environment: e.target.value,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="production">Production</option>
                      <option value="staging">Staging</option>
                      <option value="development">Development</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addOrigin}>Add Origin</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {origins.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No origins added yet
              </div>
            ) : (
              <div className="space-y-3">
                {origins.map((origin) => (
                  <div
                    key={origin.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-mono text-sm">{origin.origin}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {origin.environment}
                        </Badge>
                        {origin.isActive ? (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleOrigin(origin.id, origin.isActive)}
                      >
                        {origin.isActive ? (
                          <ToggleRight className="h-4 w-4" />
                        ) : (
                          <ToggleLeft className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteOrigin(origin.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
