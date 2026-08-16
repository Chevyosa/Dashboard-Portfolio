"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, Plus, Loader2 } from "lucide-react";
import { Project } from "@/types";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { toast } from "sonner";

export function ProjectDataTable() {
  const { data: response, error, isLoading, mutate } = useSWR('/projects', fetcher);
  const data: Project[] = response?.data || [];

  const handleDelete = async (id: string) => {
    try {
      // Optimistic update
      mutate({ ...response, data: data.filter(item => item.id !== id) }, false);
      
      await fetcher(`/projects/${id}`, { method: 'DELETE' });
      toast.success("Project deleted successfully");
      
      // Revalidate
      mutate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete project");
      mutate(); // Revert on failure
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your portfolio projects here.</p>
        </div>
        <Link href="/dashboard/projects/create">
          <Button className="rounded-xl shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-border/60 overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tech Stack</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  <div className="flex justify-center items-center">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-destructive">
                  Failed to load projects.
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No projects found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((project) => (
                <TableRow key={project.id} className="group transition-colors hover:bg-muted/20">
                  <TableCell className="font-medium">
                    {project.title}
                    <div className="text-xs text-muted-foreground font-normal mt-1">{project.slug}</div>
                  </TableCell>
                  <TableCell>
                    {project.is_published ? (
                      <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-200">
                        Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack.slice(0, 2).map(tech => (
                        <span key={tech} className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 2 && (
                        <span className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                          +{project.tech_stack.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(project.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 text-muted-foreground">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-foreground" title="Preview">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Link href={`/dashboard/projects/${project.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-foreground" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger 
                          render={
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
                              title="Delete"
                            />
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the project
                              &quot;{project.title}&quot; from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(project.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl text-white">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
