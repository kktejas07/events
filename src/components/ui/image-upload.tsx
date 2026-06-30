"use client";

import { useState, useRef } from "react";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import { Label } from "./label";

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ label, value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (json.success && json.url) {
        onChange(json.url);
      } else {
        alert(json.error || "Upload failed");
      }
    } catch {
      alert("Upload failed. Check network connection.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage() {
    onChange("");
  }

  return (
    <div className="space-y-1.5">
      <Label className="gt-admin-field-label text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        {value ? (
          <div className="flex items-center gap-2 w-full">
            <div className="relative flex items-center gap-2 flex-1 min-w-0 rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2">
              <ImageIcon className="h-4 w-4 shrink-0 text-gray-400" />
              <span className="text-sm text-gray-300 truncate">{value}</span>
              <button
                onClick={removeImage}
                className="shrink-0 rounded p-0.5 hover:bg-gray-700 text-gray-400 hover:text-red-400 transition-colors"
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              onClick={() => inputRef.current?.click()}
              className="shrink-0 rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
              type="button"
            >
              Change
            </button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-lg border border-dashed border-gray-600 hover:border-gray-400 px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50 w-full justify-center cursor-pointer"
            type="button"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Image
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
