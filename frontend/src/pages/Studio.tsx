// src/pages/Studio.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useGenerate, Generation } from '@/hooks/useGenerate';
import { useRetry } from '@/hooks/useRetry';
import ImageUpload from '@/components/ImageUpload';
import GenerationHistory from '@/components/GenerationHistory';
import { Loader2, LogOut, Sparkles, X, Download, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const STYLE_OPTIONS = [
  { value: 'photorealistic', label: 'Photorealistic' },
  { value: 'artistic', label: 'Artistic' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'modern', label: 'Modern' },
];

const Studio = () => {
  // Core form states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [restoredImageUrl, setRestoredImageUrl] = useState<string | null>(null); // image loaded from history
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('photorealistic');

  // result & history refresh
  const [result, setResult] = useState<Generation | null>(null);
  const [refreshHistory, setRefreshHistory] = useState(0);

  // auth + navigation
  const { user, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // generate hook + retry wrapper
  const { generate, abort, isLoading, error } = useGenerate({
    onSuccess: (generation) => {
      // show final result nicely, refresh history, clear inputs
      setResult(generation);
      setRefreshHistory(prev => prev + 1);

      // clear workspace inputs but keep final result displayed
      setSelectedImage(null);
      setRestoredImageUrl(null);
      setPrompt('');
      setStyle('photorealistic');

      toast({
        title: 'Generation complete',
        description: 'Your image has been generated and added to history.',
      });
    },
    onError: (errMsg) => {
      // Let retry hook handle user-facing errors; keep this no-op or additional logs
    },
  });

  const { executeWithRetry, retryCount, isRetrying } = useRetry<Generation>({
    maxRetries: 3,
    onError: (errMsg) => {
      toast({
        title: 'Generation failed',
        description: errMsg,
        variant: 'destructive',
      });
    },
    onMaxRetriesReached: () => {
      toast({
        title: 'Max retries reached',
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

  // Convert restored image url to File so useGenerate (which expects a File) works unchanged
  const urlToFile = async (url: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const ext = (blob.type && blob.type.split('/')[1]) || 'jpg';
    const filename = `restored.${ext}`;
    return new File([blob], filename, { type: blob.type });
  };

  const handleGenerate = async () => {
    // Validate
    if (!selectedImage && !restoredImageUrl) {
      toast({
        title: 'Missing Image',
        description: 'Please upload an image or choose one from history.',
        variant: 'destructive',
      });
      return;
    }
    if (!prompt || !style) {
      toast({
        title: 'Missing Input',
        description: 'Please enter a prompt and select a style.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // If user loaded an image from history (URL), convert it to File before sending
      let fileToSend: File | null = selectedImage;
      if (!fileToSend && restoredImageUrl) {
        toast({ title: 'Preparing image', description: 'Loading image from history...' });
        try {
          fileToSend = await urlToFile(restoredImageUrl);
        } catch (err) {
          toast({
            title: 'Failed to load image',
            description: 'Could not fetch the selected history image. Try downloading it first or re-upload.',
            variant: 'destructive',
          });
          return;
        }
      }

      // actual generate call (with retry wrapper)
      await executeWithRetry(() => generate(fileToSend as File, prompt, style));
    } catch (err) {
      // retry hook and generate already handle UI toasts; no extra action needed
    }
  };

  const handleHistorySelect = (generation: Generation) => {
    // Load the history item into the workspace:
    // Show the image preview (restoredImageUrl) and populate prompt/style so user can tweak and re-run
    setRestoredImageUrl(generation.imageUrl);
    setPrompt(generation.prompt);
    setStyle(generation.style);
    setResult(generation); // show it in the result area as the "current loaded"
    toast({
      title: 'Loaded from history',
      description: 'This generation is loaded into the workspace — you can edit prompt/style and re-generate.',
    });
  };

  const handleClearWorkspace = () => {
    setSelectedImage(null);
    setRestoredImageUrl(null);
    setPrompt('');
    setStyle('photorealistic');
    setResult(null);
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
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent select-none">
              AI Studio
            </h1>
            <span className="text-xs text-muted-foreground ml-2">Mini AI Studio</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">{user?.email}</div>
            <Button variant="ghost" size="sm" onClick={handleClearWorkspace} title="Clear workspace">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workspace (left + center) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Canvas / Form */}
            <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-elegant">
              <div className="flex items-start justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">Create Generation</h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                    Upload an image or select one from history. Add a prompt and choose a style — then generate.
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  {isLoading || isRetrying ? (
                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="animate-spin w-4 h-4" />
                      {retryCount > 0 ? `Retrying (${retryCount}/3)...` : 'Generating...'}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Ready</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Image area */}
                <div className="lg:col-span-1">
                  <Label className="text-base font-medium mb-3 block">Image</Label>

                  {/* If user uploaded file OR restored from history -> show preview */}
                  {selectedImage || restoredImageUrl ? (
                    <div className="relative rounded-lg overflow-hidden border border-border/30">
                      <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
                        <img
                          src={selectedImage ? URL.createObjectURL(selectedImage) : restoredImageUrl || ''}
                          alt="Selected"
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div className="flex gap-2 p-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Replace image (clear current selection so upload opens)
                            setSelectedImage(null);
                            setRestoredImageUrl(null);
                          }}
                          className="flex-1"
                        >
                          Replace
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // If we have a current preview, download it
                            const url = selectedImage ? URL.createObjectURL(selectedImage) : restoredImageUrl;
                            if (!url) return;
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'image.png';
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <ImageUpload
                      selectedImage={selectedImage}
                      onImageSelect={(file) => {
                        setSelectedImage(file);
                        setRestoredImageUrl(null);
                      }}
                      disabled={isLoading || isRetrying}
                    />
                  )}

                  {/* small hints */}
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG/PNG — max 10MB. After generating, the workspace will be cleared and result shown below.
                  </p>
                </div>

                {/* Prompt + style */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <Label htmlFor="prompt" className="text-base font-medium">Prompt</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Describe what you want to generate..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isLoading || isRetrying}
                      className="mt-2 min-h-[120px] resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-1/2">
                      <Label htmlFor="style" className="text-base font-medium">Style</Label>
                      <Select value={style} onValueChange={(val) => setStyle(val)} disabled={isLoading || isRetrying}>
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

                    <div className="flex-1 flex gap-3 justify-end">
                      <Button
                        onClick={handleGenerate}
                        disabled={(isLoading || isRetrying) || (!selectedImage && !restoredImageUrl) || !prompt}
                        className="flex items-center gap-2 bg-gradient-primary"
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
                          onClick={() => {
                            abort();
                          }}
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Abort
                        </Button>
                      )}
                    </div>
                  </div>

                  {retryCount > 0 && (
                    <Alert className="border-accent/50 bg-accent/10 mt-2">
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4 text-accent" />
                        <AlertDescription>
                          Model overloaded. Retrying ({retryCount}/3)...
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}

                  {/* small action row */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-muted-foreground">
                      Tip: Click an image on the right to load it into this workspace.
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearWorkspace}
                        title="Clear workspace"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Result / Final output */}
            {result && (
              <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-elegant">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                      <Sparkles className="text-primary h-5 w-5" />
                      Final Result
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Here’s the final generation. You can download, view full-size or use it as a base for a new generation.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => {
                      // Download
                      const a = document.createElement('a');
                      a.href = result.imageUrl;
                      a.download = 'generation.png';
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>

                    <Button onClick={() => {
                      // Use current result as loaded workspace (like re-run on same)
                      setRestoredImageUrl(result.imageUrl);
                      setPrompt(result.prompt);
                      setStyle(result.style);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      toast({ title: 'Loaded in workspace', description: 'You can tweak and generate again.' });
                    }}>
                      Re-Use
                    </Button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <div className="lg:col-span-2">
                    <div className="rounded-xl overflow-hidden border border-primary/20 shadow-md">
                      <img src={result.imageUrl} alt={result.prompt} className="w-full h-auto object-contain" />
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Prompt</div>
                      <div className="mt-1 text-sm break-words">{result.prompt}</div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground">Style</div>
                      <div className="mt-1 text-sm capitalize">{result.style}</div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground">Created</div>
                      <div className="mt-1 text-sm">{new Date(result.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: History */}
          <aside className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border/40 p-4 shadow-elegant sticky top-24">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">History</h3>
                <div className="text-sm text-muted-foreground">Recent</div>
              </div>

              <GenerationHistory
                onSelect={handleHistorySelect}
                refreshTrigger={refreshHistory}
                renderItem={(g) => (
                  <div className="group relative overflow-hidden rounded-md border border-border/30 hover:border-primary/40 cursor-pointer">
                    <img
                      src={g.imageUrl}
                      alt={g.prompt}
                      className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute left-2 bottom-2 right-2 bg-black/40 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white">
                      <div className="truncate">{g.prompt}</div>
                      <div className="text-[11px] text-muted-foreground mt-1 flex justify-between">
                        <span className="capitalize">{g.style}</span>
                        <span>{new Date(g.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              />

              <div className="mt-4 text-center text-xs text-muted-foreground">
                Click a thumbnail to load it into the workspace.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Studio;
