"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Save, X, Loader2 } from "lucide-react";
import { fetcher } from "@/lib/api";
import { toast } from "sonner";

interface Skill {
  id: string;
  name: string;
  icon?: string | null;
}

export function SkillsManager() {
  const { data, error, isLoading, mutate } = useSWR("/skills", fetcher);
  const skills: Skill[] = data?.data || [];

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetcher("/skills", {
        method: "POST",
        body: JSON.stringify({ name, icon: icon || null }),
      });
      toast.success("Skill added");
      setName("");
      setIcon("");
      mutate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add skill");
    }
  };

  const startEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setEditName(skill.name);
    setEditIcon(skill.icon || "");
  };

  const cancelEdit = () => setEditingId(null);

  const handleSave = async (id: string) => {
    try {
      await fetcher(`/skills/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name: editName, icon: editIcon || null }),
      });
      toast.success("Skill updated");
      setEditingId(null);
      mutate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update skill");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetcher(`/skills/${id}`, { method: "DELETE" });
      toast.success("Skill deleted");
      mutate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete skill");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Core Stack</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage the canonical tech stack shown on your portfolio. Custom tech added to a project lands here automatically.
        </p>
      </div>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Skill name (e.g. Supabase)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-xl"
        />
        <Input
          placeholder="Icon slug (Simple Icons, optional)"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="rounded-xl"
        />
        <Button type="submit" className="rounded-xl shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </form>

      <div className="rounded-2xl border border-border/60 overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[280px]">Name</TableHead>
              <TableHead>Icon Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  <div className="flex justify-center items-center">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24 text-destructive">
                  Failed to load skills.
                </TableCell>
              </TableRow>
            ) : skills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                  No skills yet.
                </TableCell>
              </TableRow>
            ) : (
              skills.map((skill) =>
                editingId === skill.id ? (
                  <TableRow key={skill.id}>
                    <TableCell>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="rounded-lg h-9"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editIcon}
                        onChange={(e) => setEditIcon(e.target.value)}
                        placeholder="optional"
                        className="rounded-lg h-9"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" className="rounded-lg h-8" onClick={() => handleSave(skill.id)}>
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" className="rounded-lg h-8" onClick={cancelEdit}>
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={skill.id} className="group">
                    <TableCell className="font-medium">{skill.name}</TableCell>
                    <TableCell>
                      {skill.icon ? (
                        <Badge variant="secondary" className="rounded-md font-mono">
                          {skill.icon}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          auto (derived from name)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => startEdit(skill)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
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
                            <Trash2 className="w-4 h-4" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete skill?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove &quot;{skill.name}&quot; from your Core Stack.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(skill.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
