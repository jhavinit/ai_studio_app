import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useGenerate, Generation } from '@/hooks/useGenerate';
import { useRetry } from '@/hooks/useRetry';
import ImageUpload from '@/components/ImageUpload';
import GenerationHistory from '@/components/GenerationHistory';
import { Loader2, LogOut, Sparkles, X, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const STYLE_OPTIONS = [
  { value: 'photorealistic', label: 'Photorealistic' },
  { value: 'artistic', label: 'Artistic' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'modern', label: 'Modern' },
];

const Studio = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('photorealistic');
  const [result, setResult] = useState<Generation | null>(null);
  const [refreshHistory, setRefreshHistory] = useState(0);
  
  const { user, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { generate, abort, isLoading, error } = useGenerate({
    onSuccess: (generation) => {
      setResult(generation);
      setRefreshHistory(prev => prev + 1);
      toast({
        title: 'Generation Complete!',
        description: 'Your image has been generated successfully',
      });
    },
    onError: (error) => {
      // Error handling is done in retry hook
    },
  });

  const { executeWithRetry, retryCount, isRetrying } = useRetry<Generation>({
    maxRetries: 3,
    onError: (error) => {
      toast({
        title: 'Generation Failed',
        description: error,
        variant: 'destructive',
      });
    },
    onMaxRetriesReached: () => {
      toast({
        title: 'Max Retries Reached',
        description: 'The model is currently overloaded. Please try again later.',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleGenerate = async () => {
    if (!selectedImage || !prompt || !style) {
      toast({
        title: 'Missing Information',
        description: 'Please upload an image, enter a prompt, and select a style',
        variant: 'destructive',
      });
      return;
    }

    try {
      await executeWithRetry(() => generate(selectedImage, prompt, style));
    } catch (error) {
      // Error already handled by retry hook
    }
  };

  const handleHistorySelect = (generation: Generation) => {
    setResult(generation);
    setPrompt(generation.prompt);
    setStyle(generation.style);
    
    toast({
      title: 'Generation Restored',
      description: 'Previous generation loaded into workspace',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Studio
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Generation Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border border-border/40 p-6 shadow-elegant">
              <h2 className="text-2xl font-semibold mb-6">Create Generation</h2>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">Upload Image</Label>
                  <ImageUpload
                    selectedImage={selectedImage}
                    onImageSelect={setSelectedImage}
                    disabled={isLoading || isRetrying}
                  />
                </div>

                <div>
                  <Label htmlFor="prompt" className="text-base font-medium">
                    Prompt
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe what you want to generate..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading || isRetrying}
                    className="mt-2 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="style" className="text-base font-medium">
                    Style
                  </Label>
                  <Select value={style} onValueChange={setStyle} disabled={isLoading || isRetrying}>
                    <SelectTrigger id="style" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {retryCount > 0 && (
                  <Alert className="border-accent/50 bg-accent/10">
                    <AlertCircle className="h-4 w-4 text-accent" />
                    <AlertDescription>
                      Model overloaded. Retrying ({retryCount}/3)...
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={isLoading || isRetrying || !selectedImage || !prompt}
                    className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
                  >
                    {isLoading || isRetrying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {retryCount > 0 ? `Retrying (${retryCount}/3)...` : 'Generating...'}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate
                      </>
                    )}
                  </Button>
                  
                  {(isLoading || isRetrying) && (
                    <Button
                      onClick={abort}
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Abort
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Result Display */}
            {result && (
              <div className="bg-card rounded-lg border border-border/40 p-6 shadow-elegant">
                <h2 className="text-2xl font-semibold mb-4">Result</h2>
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden border border-primary/20">
                    <img
                      src={result.imageUrl}
                      alt={result.prompt}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Prompt:</span> {result.prompt}</p>
                    <p><span className="font-medium">Style:</span> <span className="capitalize">{result.style}</span></p>
                    <p><span className="font-medium">Created:</span> {new Date(result.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-1">
            <GenerationHistory 
              onSelect={handleHistorySelect}
              refreshTrigger={refreshHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
