"use client";

import { useState } from "react";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, Loader2 } from "lucide-react";
import { fetcher } from "@/lib/api";

interface Skill {
  id: string;
  name: string;
  icon?: string | null;
}

interface TechStackPickerProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function TechStackPicker({ value, onChange }: TechStackPickerProps) {
  const { data, isLoading } = useSWR("/public/skills", fetcher);
  const skills: Skill[] = data?.data || [];
  const [input, setInput] = useState("");

  const add = (raw: string) => {
    const name = raw.trim();
    if (!name) return;
    if (!value.includes(name)) onChange([...value, name]);
    setInput("");
  };

  const remove = (name: string) => onChange(value.filter((t) => t !== name));

  const available = skills.filter((s) => !value.includes(s.name));

  return (
    <div className="space-y-2 pt-2 border-t border-border/50">
      <label className="text-sm font-medium">Tech Stack</label>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="pr-1 rounded-md">
              {tag}
              <button
                type="button"
                onClick={() => remove(tag)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Loader2 className="w-3 h-3 animate-spin" />
          Loading core stack...
        </div>
      ) : available.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-2">
          {available.map((skill) => (
            <button
              key={skill.id}
              type="button"
              onClick={() => add(skill.name)}
              className="px-2 py-0.5 rounded-md border border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              + {skill.name}
            </button>
          ))}
        </div>
      ) : null}

      <Input
        placeholder="Type custom tech and press enter..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add(input);
          }
        }}
        className="rounded-xl"
      />
      <p className="text-xs text-muted-foreground">
        Pilih dari Core Stack, atau ketik custom lalu Enter — otomatis masuk ke Core Stack.
      </p>
    </div>
  );
}
