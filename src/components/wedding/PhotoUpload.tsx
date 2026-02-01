import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Camera, Upload, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoUploadProps {
  label: string;
  sublabel?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  className?: string;
}

export function PhotoUpload({ label, sublabel, value, onChange, className }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative w-32 h-32 mx-auto rounded-full border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden group",
          isDragging
            ? "border-primary bg-primary/10 scale-105"
            : value
            ? "border-secondary"
            : "border-border hover:border-primary/50 hover:bg-accent/50"
        )}
      >
        {value ? (
          <>
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
            >
              <X className="w-3 h-3" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground group-hover:text-primary transition-colors">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
              <User className="w-6 h-6" />
            </div>
            <Upload className="w-4 h-4" />
          </div>
        )}
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Click or drag to upload
      </p>
    </div>
  );
}
