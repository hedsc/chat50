"use client";

import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagInput({
  tags,
  onChange,
  placeholder = "Adicionar palavra-chave…",
  className,
}: TagInputProps) {
  const [inputVal, setInputVal] = useState("");

  const adicionarTag = () => {
    const nova = inputVal.trim().replace(/,+$/, "");
    if (nova && !tags.includes(nova)) {
      onChange([...tags, nova]);
    }
    setInputVal("");
  };

  const removerTag = (idx: number) => {
    onChange(tags.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      adicionarTag();
    }
    if (e.key === "Backspace" && !inputVal && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-[42px] w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-white px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className
      )}
    >
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
        >
          {tag}
          <button
            type="button"
            onClick={() => removerTag(idx)}
            className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <div className="flex flex-1 items-center gap-1 min-w-[140px]">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent outline-none placeholder:text-gray-400 text-sm"
        />
        {inputVal.trim() && (
          <button
            type="button"
            onClick={adicionarTag}
            className="flex items-center gap-0.5 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary hover:bg-primary/20 transition-colors"
          >
            <Plus className="h-3 w-3" />
            Adicionar
          </button>
        )}
      </div>
    </div>
  );
}
