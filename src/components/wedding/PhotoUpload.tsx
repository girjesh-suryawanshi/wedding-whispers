import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Camera, Upload, X, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ImageCropper } from '@/components/ui/image-cropper';
import { api } from '@/services/api';

interface PhotoUploadProps {
  label: string;
  sublabel?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  className?: string;
  folder?: string;
}

export function PhotoUpload({ label, sublabel, value, onChange, className, folder = 'photos' }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { user } = useAuth();

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    // Read file for cropping
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (croppedImageBlob: Blob) => {
    setIsUploading(true);
    try {
      // Create a File object from the Blob for the API
      const file = new File([croppedImageBlob], 'photo.jpg', { type: 'image/jpeg' });
      const data = await api.uploadFile(file);

      onChange(data.url);
      toast.success('Photo uploaded!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
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

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Local delete not implemented yet, just clearing the value
    // In future: Call DELETE /api/upload with filename

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
        disabled={isUploading}
      />

      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative w-32 h-32 mx-auto rounded-full border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden group",
          isUploading && "cursor-wait",
          isDragging
            ? "border-primary bg-primary/10 scale-105"
            : value
              ? "border-secondary"
              : "border-border hover:border-primary/50 hover:bg-accent/50"
        )}
      >
        {isUploading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : value ? (
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

      <ImageCropper
        imageSrc={selectedImage}
        isOpen={showCropper}
        onClose={() => setShowCropper(false)}
        onCropComplete={handleUpload}
      />
    </div>
  );
}
