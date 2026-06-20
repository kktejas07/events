"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

interface Field {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea" | "checkbox";
  placeholder?: string;
}

interface ListEditorProps {
  items: Record<string, unknown>[];
  fields: Field[];
  onChange: (items: Record<string, unknown>[]) => void;
  renderExtra?: (
    item: Record<string, unknown>,
    index: number,
    update: (k: string, v: unknown) => void
  ) => React.ReactNode;
}

export function ListEditor({ items, fields, onChange, renderExtra }: ListEditorProps) {
  function updateItem(index: number, key: string, value: unknown) {
    const updated = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    onChange(updated);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    const empty: Record<string, unknown> = {};
    for (const f of fields) {
      empty[f.key] = f.type === "number" ? 0 : f.type === "checkbox" ? false : "";
    }
    onChange([...items, empty]);
  }

  function moveItem(index: number, direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const updated = [...items];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    onChange(updated);
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <Card key={i} className="border-white/10 bg-white/[0.03]">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Item #{i + 1}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-500 hover:text-white"
                  onClick={() => moveItem(i, "up")}
                  disabled={i === 0}
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-500 hover:text-white"
                  onClick={() => moveItem(i, "down")}
                  disabled={i === items.length - 1}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-400 hover:text-red-300"
                  onClick={() => removeItem(i)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div
              className={`grid gap-3 ${fields.length <= 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}
            >
              {fields.map((field) => (
                <div key={field.key} className="space-y-1">
                  <Label className="text-xs text-gray-400">{field.label}</Label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={String(item[field.key] ?? "")}
                      onChange={(e) => updateItem(i, field.key, e.target.value)}
                      className="min-h-[60px] w-full resize-y rounded-md border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-white"
                    />
                  ) : field.type === "checkbox" ? (
                    <input
                      type="checkbox"
                      checked={Boolean(item[field.key])}
                      onChange={(e) => updateItem(i, field.key, e.target.checked)}
                      className="ml-1 mt-2 h-4 w-4 accent-purple-500"
                    />
                  ) : (
                    <Input
                      type={field.type === "number" ? "number" : "text"}
                      value={String(item[field.key] ?? "")}
                      onChange={(e) =>
                        updateItem(
                          i,
                          field.key,
                          field.type === "number" ? Number(e.target.value) : e.target.value
                        )
                      }
                      placeholder={field.placeholder}
                      className="border-white/10 bg-white/[0.05] text-xs text-white placeholder:text-gray-600"
                    />
                  )}
                </div>
              ))}
            </div>
            {renderExtra?.(item, i, (k, v) => updateItem(i, k, v))}
          </CardContent>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={addItem}
        className="w-full border-dashed border-white/20 text-gray-400 hover:border-purple-400/30 hover:text-purple-300"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
    </div>
  );
}
