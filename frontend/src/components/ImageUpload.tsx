import { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  disabled?: boolean;
}

const ImageUpload = ({ onImageSelect, selectedImage, disabled }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload an image file (JPEG or PNG)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please upload an image smaller than 10MB',
        variant: 'destructive',
      });
      return;
    }

    onImageSelect(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect, toast]);

  const clearImage = useCallback(() => {
    setPreview(null);
    onImageSelect(null as any);
  }, [onImageSelect]);

  return (
    <div className="space-y-4">
      <div className="relative">
        {preview ? (
          <div className="relative rounded-lg overflow-hidden border-2 border-primary/20 bg-card">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-64 object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={clearImage}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label 
            htmlFor="image-upload" 
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              disabled 
                ? 'border-muted bg-muted/50 cursor-not-allowed' 
                : 'border-primary/30 bg-muted/20 hover:bg-muted/40 hover:border-primary/50'
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className={`w-12 h-12 mb-4 ${disabled ? 'text-muted-foreground' : 'text-primary'}`} />
              <p className="mb-2 text-sm font-medium">
                Click to upload image
              </p>
              <p className="text-xs text-muted-foreground">
                JPEG or PNG (MAX. 10MB)
              </p>
            </div>
            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              disabled={disabled}
            />
          </label>
        )}
      </div>
      
      {selectedImage && (
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">{selectedImage.name}</p>
          <p>{(selectedImage.size / 1024).toFixed(2)} KB</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
