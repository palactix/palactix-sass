import { useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaItem } from "@/types/scheduler";
import { Image as ImageIcon, Video, Upload, X } from "lucide-react";
import Image from "next/image";

interface MediaUploaderProps {
  maxItems?: number;
}

export function MediaUploader({ maxItems = 10 }: MediaUploaderProps) {
  const { setValue, control } = useFormContext();
  const media = useWatch({ control, name: "media" }) as MediaItem[];

  const handleAdd = useCallback((files: FileList) => {
    const current = media || [];
    const remaining = Math.max(0, maxItems - current.length);
    const incoming: MediaItem[] = Array.from(files)
      .slice(0, remaining)
      .map((file, index) => ({
        id: `${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video") ? "video" : "image",
        altText: "",
      }));
    setValue("media", [...current, ...incoming], { shouldDirty: true });
  }, [media, maxItems, setValue]);

  const handleRemove = useCallback((id: string | number) => {
    const next = (media || []).filter((item) => item.id !== id);
    setValue("media", next, { shouldDirty: true });
  }, [media, setValue]);

  const handleAlt = useCallback((id: string | number, alt: string) => {
    const next = (media || []).map((item) => item.id === id ? { ...item, altText: alt } : item);
    setValue("media", next, { shouldDirty: true });
  }, [media, setValue]);

  return (
    <Card className="p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Media Upload</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Upload up to {maxItems} images or videos (Max 50MB each)</p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {media.length} / {maxItems}
        </Badge>
      </div>

      <div className="space-y-4">
        {media.length < maxItems && (
          <label
            className="cursor-pointer"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.dataTransfer?.files?.length) {
                handleAdd(e.dataTransfer.files);
              }
            }}
          >
            <div className="border-2 border-dashed rounded-lg p-8 hover:border-primary/50 hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-full bg-primary/10 p-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Click or drag & drop media</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF, MP4, MOV up to 50MB
                  </p>
                </div>
              </div>
            </div>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => e.target.files && handleAdd(e.target.files)}
              className="hidden"
            />
          </label>
        )}

        {media.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => (
              <Card key={item.id} className="p-3 space-y-3 border-2 hover:border-primary/50 transition-colors">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  {item.type === "video" ? (
                    <video src={item.url} className="w-full h-full object-cover" />
                  ) : (
                    <Image src={item.url} alt="" fill className="object-cover" />
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-[10px] bg-black/70 text-white border-0">
                      {item.type === "video" ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                    </Badge>
                  </div>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => handleRemove(item.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div>
                  <Label className="text-xs mb-1.5">Alt Text (Optional)</Label>
                  <Input
                    placeholder="Describe this media..."
                    value={item.altText}
                    onChange={(e) => handleAlt(item.id, e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
