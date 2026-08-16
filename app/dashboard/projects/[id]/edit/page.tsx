"use client";

import { use } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { ProjectEditorForm } from "@/components/projects/project-form";
import { Loader2 } from "lucide-react";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const { data: response, error, isLoading } = useSWR(`/projects/${id}`, fetcher);
  
  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  if (error || !response?.data) return <div className="p-10 text-destructive text-center">Project not found or failed to load.</div>;

  return (
    <div className="py-2">
      <ProjectEditorForm initialData={response.data} />
    </div>
  );
}
