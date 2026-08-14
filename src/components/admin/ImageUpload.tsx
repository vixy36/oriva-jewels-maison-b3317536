import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload an image file");
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).slice(2, 10)}-${Date.now()}.${fileExt}`;
      const filePath = `page-content/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("products") // Reusing products bucket for now as it's likely already configured
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("products").getPublicUrl(filePath);
      onChange(data.publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Error uploading image");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex flex-col gap-3">
        {value ? (
          <div className="relative group w-full aspect-video md:aspect-square md:w-32 rounded border border-border/60 overflow-hidden bg-muted/20">
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
            <button
              onClick={() => onChange("")}
              className="absolute top-1 right-1 p-1 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : null}
        
        <div className="flex gap-2">
          <Input 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder="Paste image URL..." 
            className="flex-1"
          />
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleUpload}
              disabled={uploading}
            />
            <Button variant="outline" size="icon" disabled={uploading} type="button">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
