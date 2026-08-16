"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetcher } from "@/lib/api";

interface ImageUploaderProps {
  label: string;
  hint?: string;
  kind: "cover" | "gallery";
  multiple?: boolean;
  max?: number;
  value: string[];
  onChange: (urls: string[]) => void;
}

async function uploadFile(file: File, kind: string): Promise<string> {
  const res = await fetcher("/uploads/presign", {
    method: "POST",
    body: JSON.stringify({ filename: file.name, contentType: file.type, kind }),
  });

  const { uploadUrl, publicUrl } = res.data;

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  if (!putRes.ok) {
    throw new Error("Failed to upload image to storage");
  }

  return publicUrl;
}

export function ImageUploader({
  label,
  hint,
  kind,
  multiple = false,
  max = 1,
  value,
  onChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFiles = async (files: FileList | File[]) => {
    const images = Array.from(files).filter((f) => f.type.startsWith("image/"));

    if (images.length === 0) {
      toast.error("Only image files are allowed");
      return;
    }

    const remaining = multiple ? max - value.length : 1;
    const toUpload = images.slice(0, Math.max(0, remaining));

    if (toUpload.length === 0) {
      toast.error(`Maximum ${max} image${max > 1 ? "s" : ""} allowed`);
      return;
    }

    setIsUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of toUpload) {
        uploaded.push(await uploadFile(file, kind));
      }

      if (multiple) {
        onChange([...value, ...uploaded].slice(0, max));
      } else {
        onChange(uploaded.slice(0, 1));
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (url: string) => {
    onChange(value.filter((item) => item !== url));
  };

  return (
    <div className="space-y-2 pt-2 border-t border-border/50">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {multiple && (
          <span className="text-xs text-muted-foreground">
            {value.length}/{max}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center cursor-pointer transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"
        }`}
      >
        {isUploading ? (
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        ) : (
          <Upload className="w-6 h-6 text-muted-foreground" />
        )}
        <p className="text-sm text-muted-foreground">
          {isUploading
            ? "Uploading..."
            : "Drag & drop or click to choose image"}
        </p>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {value.map((url) => (
            <div
              key={url}
              className="relative h-20 w-20 rounded-lg overflow-hidden border border-border group"
            >
              <Image
                src={url}
                alt="upload"
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
