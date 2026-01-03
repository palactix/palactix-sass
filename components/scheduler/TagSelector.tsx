"use client";

import { useMemo, useState, KeyboardEvent, useRef, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCreateTagMutation, useTags, tagsKeys } from "@/features/tags/hooks/useTags";
import { useOrganizationStore } from "@/features/organization/stores/organization.store";
import { useQueryClient } from "@tanstack/react-query";
import { Tag } from "@/features/tags/types";

export function TagSelector() {
  const { control, setValue } = useFormContext();
  const tagIds = useWatch({ control, name: "tag_ids" }) as string[];
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const queryClient = useQueryClient();
  const currentOrgId = useOrganizationStore((state) => state.currentOrganization?.id);
  const orgId = useOrganizationStore((state) => state.currentOrganization?.slug ?? "");
  const { data: tags = [], isLoading } = useTags();
  const createTagMutation = useCreateTagMutation();

  const selectedTags = useMemo(() => {
    return tags.filter((tag) => tagIds?.includes(tag.id));
  }, [tags, tagIds]);

  const filteredTags = useMemo(() => {
    if (!inputValue.trim()) {
      return tags.slice(0, 5);
    }
    const query = inputValue.toLowerCase().trim();
    return tags.filter((tag) => tag.name.toLowerCase().includes(query)).slice(0, 5);
  }, [tags, inputValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (tagId: string) => {
    const currentTags = tagIds || [];
    if (currentTags.includes(tagId)) {
      setValue(
        "tag_ids",
        currentTags.filter((id) => id !== tagId),
        { shouldDirty: true }
      );
    } else {
      setValue("tag_ids", [...currentTags, tagId], { shouldDirty: true });
    }
  };

  const handleRemove = (tagId: string) => {
    const currentTags = tagIds || [];
    setValue(
      "tag_ids",
      currentTags.filter((id) => id !== tagId),
      { shouldDirty: true }
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      
      // Check if tag already exists
      const existingTag = tags.find(
        (tag) => tag.name.toLowerCase() === inputValue.trim().toLowerCase()
      );

      if (existingTag) {
        // Select existing tag
        handleSelect(existingTag.id);
      } else {
        // Create new tag and add it to the selected tags
        const newTagId = `new-${Date.now()}`;
        const currentTags = tagIds || [];
        setValue("tag_ids", [...currentTags, newTagId], { shouldDirty: true });
        
        createTagMutation.mutate(
          { name: inputValue.trim() },
          {
            onSuccess: (response) => {
              // Update the tag_ids with the real ID from API
              setValue(
                "tag_ids",
                currentTags
                  .filter((id) => id !== newTagId)
                  .concat(response.tag.id),
                { shouldDirty: true }
              );
              
              // Add the new tag to the cached tags list
              const queryKey = tagsKeys.tags(currentOrgId?.toString() || "");
              queryClient.setQueryData<{ data: Tag[] }>(queryKey, (old) => {
                if (!old) return { data: [response.tag] };
                return {
                  ...old,
                  data: [...old.data, response.tag]
                };
              });
            },
          }
        );
      }
      
      setInputValue("");
      setIsDropdownOpen(false);
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "Backspace" && !inputValue && tagIds?.length > 0) {
      // Remove last tag if input is empty and backspace is pressed
      const currentTags = tagIds || [];
      setValue("tag_ids", currentTags.slice(0, -1), { shouldDirty: true });
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "min-h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "flex flex-wrap gap-1.5 items-center",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {selectedTags.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="text-xs gap-1 pr-1 h-6"
            style={{ borderColor: tag.color, borderWidth: 1 }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            {tag.name}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(tag.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          type="text"
          placeholder={selectedTags.length === 0 ? "Add tags (optional)" : ""}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsDropdownOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsDropdownOpen(true)}
          disabled={isLoading}
          className="flex-1 min-w-[120px] outline-none bg-transparent placeholder:text-muted-foreground"
        />
      </div>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-md shadow-md max-h-60 overflow-auto">
          {filteredTags.length === 0 && inputValue.trim() ? (
            <div className="p-2 text-sm text-muted-foreground">
              Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">Enter</kbd> to create &quot;{inputValue}&quot;
            </div>
          ) : filteredTags.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground">No tags found.</div>
          ) : (
            <div className="p-1">
              {filteredTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    handleSelect(tag.id);
                    setInputValue("");
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground",
                    tagIds?.includes(tag.id) && "bg-accent text-accent-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      tagIds?.includes(tag.id)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50"
                    )}
                  >
                    {tagIds?.includes(tag.id) && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="flex-1 text-left">{tag.name}</span>
                  {tag.type === "system" && (
                    <Badge variant="secondary" className="text-[10px] h-4 px-1">
                      System
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
