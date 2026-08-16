"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ArrowLeft, Save } from "lucide-react";

import { Project } from "@/types";
import { toast } from "sonner";
import { fetcher } from "@/lib/api";

export function ProjectEditorForm({ initialData }: { initialData?: Project }) {
  const router = useRouter();
  
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [techInput, setTechInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>(initialData?.tech_stack || []);
  const [liveUrl, setLiveUrl] = useState(initialData?.live_url || "");
  const [repoUrl, setRepoUrl] = useState(initialData?.repo_url || "");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [isPublished, setIsPublished] = useState(initialData?.is_published || false);

  // Auto generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  // Handle tech stack tags
  const handleTechInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTech = techInput.trim();
      if (newTech && !techStack.includes(newTech)) {
        setTechStack([...techStack, newTech]);
      }
      setTechInput("");
    }
  };

  const removeTech = (techToRemove: string) => {
    setTechStack(techStack.filter(tech => tech !== techToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title, slug, excerpt, content, tech_stack: techStack, live_url: liveUrl, repo_url: repoUrl, image_url: imageUrl, is_published: isPublished, order_index: initialData?.order_index || 0
      };
      
      if (initialData?.id) {
        await fetcher(`/projects/${initialData.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        toast.success("Project updated successfully!");
      } else {
        await fetcher('/projects', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast.success("Project created successfully!");
      }
      
      router.push('/dashboard/projects');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save project");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{initialData ? "Edit Project" : "Create Project"}</h1>
            <p className="text-sm text-muted-foreground mt-1">{initialData ? "Update your existing project details." : "Add a new project to your portfolio."}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-xl">Cancel</Button>
          <Button type="submit" className="rounded-xl">
            <Save className="w-4 h-4 mr-2" />
            Save Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-border/50 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  placeholder="e.g. E-Commerce Dashboard" 
                  value={title}
                  onChange={handleTitleChange}
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input 
                  placeholder="e-commerce-dashboard" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="rounded-xl bg-muted/30"
                />
                <p className="text-xs text-muted-foreground">Auto-generated from title, must be unique.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Excerpt</label>
                <Input 
                  placeholder="Short description of the project" 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content (Markdown)</label>
                <textarea 
                  className="flex min-h-[300px] w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                  placeholder="Write your project details here in markdown..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border/50 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium flex justify-between items-center">
                  <span>Status</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Published</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </label>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/50">
                <label className="text-sm font-medium">Tech Stack</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {techStack.map(tech => (
                    <Badge key={tech} variant="secondary" className="pr-1 rounded-md">
                      {tech}
                      <button 
                        type="button" 
                        onClick={() => removeTech(tech)}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input 
                  placeholder="Type and press enter..." 
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleTechInputKeyDown}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-border/50">
                <label className="text-sm font-medium">Image URL</label>
                <Input 
                  placeholder="https://..." 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Live URL</label>
                <Input 
                  placeholder="https://..." 
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Repository URL</label>
                <Input 
                  placeholder="https://github.com/..." 
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
