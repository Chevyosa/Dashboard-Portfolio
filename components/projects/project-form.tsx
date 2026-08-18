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
import { ImageUploader } from "@/components/projects/image-uploader";
import { TechStackPicker } from "@/components/projects/tech-stack-picker";

interface TagFieldProps {
  label: string;
  placeholder: string;
  tags: string[];
  input: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (tag: string) => void;
}

function TagField({ label, placeholder, tags, input, onInputChange, onAdd, onRemove }: TagFieldProps) {
  return (
    <div className="space-y-2 pt-2 border-t border-border/50">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="pr-1 rounded-md">
            {tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        placeholder={placeholder}
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            onAdd();
          }
        }}
        className="rounded-xl"
      />
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium flex justify-between items-center">
        <span>{label}</span>
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
            />
            <div className="w-9 h-5 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </label>
    </div>
  );
}

export function ProjectEditorForm({ initialData }: { initialData?: Project }) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [challenge, setChallenge] = useState(initialData?.challenge || "");
  const [solution, setSolution] = useState(initialData?.solution || "");
  const [techStack, setTechStack] = useState<string[]>(initialData?.tech_stack || []);
  const [results, setResults] = useState<string[]>(initialData?.results || []);
  const [resultInput, setResultInput] = useState("");
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);
  const [liveUrl, setLiveUrl] = useState(initialData?.live_url || "");
  const [repoUrl, setRepoUrl] = useState(initialData?.repo_url || "");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [year, setYear] = useState(initialData?.year ? String(initialData.year) : "");
  const [isPublished, setIsPublished] = useState(initialData?.is_published || false);
  const [confidential, setConfidential] = useState(initialData?.confidential || false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const addTag = (input: string, current: string[], setCurrent: (v: string[]) => void, setInput: (v: string) => void) => {
    const newTag = input.trim();
    if (newTag && !current.includes(newTag)) {
      setCurrent([...current, newTag]);
    }
    setInput("");
  };

  const removeTag = (list: string[], setList: (v: string[]) => void, tag: string) => {
    setList(list.filter((t) => t !== tag));
  };

  const handleConfidentialChange = (v: boolean) => {
    setConfidential(v);
    if (v) {
      setLiveUrl("");
      setRepoUrl("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        slug,
        subtitle,
        excerpt,
        challenge,
        solution,
        results,
        tech_stack: techStack,
        image_url: imageUrl,
        gallery,
        live_url: confidential ? "" : liveUrl,
        repo_url: confidential ? "" : repoUrl,
        year: year ? parseInt(year, 10) : null,
        confidential,
        is_published: isPublished,
        order_index: initialData?.order_index || 0
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
                <label className="text-sm font-medium">Subtitle</label>
                <Input
                  placeholder="Short headline for this project"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="Short description of the project"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Challenge</label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                  placeholder="What problem did this project solve?"
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Solution</label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                  placeholder="How was the project implemented?"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border/50 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <Toggle label="Status (Published)" checked={isPublished} onChange={setIsPublished} />
              <Toggle label="Confidential" checked={confidential} onChange={handleConfidentialChange} />

              <TechStackPicker value={techStack} onChange={setTechStack} />

              <TagField
                label="Results"
                placeholder="Type a result and press enter..."
                tags={results}
                input={resultInput}
                onInputChange={setResultInput}
                onAdd={() => addTag(resultInput, results, setResults, setResultInput)}
                onRemove={(tag) => removeTag(results, setResults, tag)}
              />

              <ImageUploader
                label="Gallery Images"
                hint="Up to 10 images"
                kind="gallery"
                multiple
                max={10}
                value={gallery}
                onChange={setGallery}
              />

              <ImageUploader
                label="Cover Image"
                kind="cover"
                max={1}
                value={imageUrl ? [imageUrl] : []}
                onChange={(urls) => setImageUrl(urls[0] || "")}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Input
                  placeholder="e.g. 2026"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Live URL</label>
                <Input
                  placeholder="https://..."
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  disabled={confidential}
                  className="rounded-xl"
                />
                {confidential && (
                  <p className="text-xs text-muted-foreground">
                    Disabled for confidential projects.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Repository URL</label>
                <Input
                  placeholder="https://github.com/..."
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  disabled={confidential}
                  className="rounded-xl"
                />
                {confidential && (
                  <p className="text-xs text-muted-foreground">
                    Disabled for confidential projects.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
