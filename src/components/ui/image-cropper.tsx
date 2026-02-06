import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Check, X, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import { getCroppedImg } from '@/lib/imageUtils';

interface ImageCropperProps {
    imageSrc: string | null;
    isOpen: boolean;
    onClose: () => void;
    onCropComplete: (croppedImage: Blob) => void;
    aspectRatio?: number;
}

export function ImageCropper({
    imageSrc,
    isOpen,
    onClose,
    onCropComplete,
    aspectRatio = 1
}: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteCallback = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        setIsLoading(true);
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedImage) {
                onCropComplete(croppedImage);
                onClose();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Edit Photo</DialogTitle>
                </DialogHeader>

                <div className="relative w-full h-80 bg-black/5 rounded-lg overflow-hidden my-4">
                    {imageSrc && (
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={onCropChange}
                            onCropComplete={onCropCompleteCallback}
                            onZoomChange={onZoomChange}
                        />
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <ZoomOut className="w-4 h-4 text-muted-foreground" />
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(value) => setZoom(value[0])}
                            className="flex-1"
                        />
                        <ZoomIn className="w-4 h-4 text-muted-foreground" />
                    </div>

                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button variant="outline" onClick={onClose} disabled={isLoading}>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isLoading} className="btn-royal">
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Check className="w-4 h-4 mr-2" />
                            )}
                            Save Crop
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
