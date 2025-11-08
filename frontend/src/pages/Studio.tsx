import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useGenerate, Generation } from "@/hooks/useGenerate";
import { useRetry } from "@/hooks/useRetry";
import ImageUpload from "@/components/ImageUpload";
import GenerationHistory from "@/components/GenerationHistory";
import {
  Loader2,
  LogOut,
  Sparkles,
  X,
  Download,
  Trash2,
  // Broom,
} from "lucide-react";
import { motion } from "framer-motion";
import AbortConfirmationDialog from "@/components/AbortConfirmationDialog";

const STYLE_OPTIONS = [
  { value: "photorealistic", label: "Photorealistic" },
  { value: "artistic", label: "Artistic" },
  { value: "abstract", label: "Abstract" },
  { value: "vintage", label: "Vintage" },
  { value: "modern", label: "Modern" },
];

const Studio = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [restoredImageUrl, setRestoredImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("photorealistic");
  const [result, setResult] = useState<Generation | null>(null);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [showAbortDialog, setShowAbortDialog] = useState(false);

  const { user, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { generate, abort, isLoading } = useGenerate({
    onSuccess: (generation) => {
      setResult(generation);
      setRefreshHistory((prev) => prev + 1);
      setSelectedImage(null);
      setRestoredImageUrl(null);
      setPrompt("");
      setStyle("photorealistic");
      toast({
        title: "Generation Complete",
        description: "Your image has been generated successfully.",
      });
    },
  });

  const { executeWithRetry, isRetrying } = useRetry<Generation>({
    maxRetries: 3,
    onError: (errMsg) => {
      toast({
        title: "Generation Failed",
        description: errMsg,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  const urlToFile = async (url: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const ext = blob.type.split("/")[1] || "jpg";
    return new File([blob], `restored.${ext}`, { type: blob.type });
  };

  const handleGenerate = async () => {
    if (!selectedImage && !restoredImageUrl)
      return toast({
        title: "Missing Image",
        description: "Upload or choose an image first.",
        variant: "destructive",
      });

    if (!prompt || !style)
      return toast({
        title: "Missing Input",
        description: "Enter a prompt and select a style.",
        variant: "destructive",
      });

    let fileToSend = selectedImage;
    if (!fileToSend && restoredImageUrl)
      fileToSend = await urlToFile(restoredImageUrl);
    await executeWithRetry(() => generate(fileToSend as File, prompt, style));
  };

  // 🧠 Load data from history but don't show final result
  const handleHistorySelect = (g: Generation) => {
    setRestoredImageUrl(g.imageUrl);
    setPrompt(g.prompt);
    setStyle(g.style);
    setResult(null); // don't render final result
    toast({ title: "Loaded from history" });
  };

  if (authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header
        className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50"
        role="banner"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" aria-hidden="true" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Studio
            </h1>
            <span className="text-xs text-muted-foreground ml-2">
              Mini AI Studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        className="container mx-auto px-4 py-8"
        role="main"
        aria-labelledby="workspace-heading"
      >
        <h2 id="workspace-heading" className="sr-only">
          Image generation workspace
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workspace */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Section */}
            <section
              className="bg-card rounded-2xl border border-border/40 p-6 shadow-elegant"
              aria-labelledby="create-section"
            >
              <h3
                id="create-section"
                className="text-2xl font-semibold mb-2 flex items-center gap-2"
              >
                <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
                Create Generation
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Upload or select an image, enter a prompt, and choose a style.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload */}
                <div className="lg:col-span-1">
                  <Label className="text-base font-medium mb-3 block">
                    Image
                  </Label>
                  {selectedImage || restoredImageUrl ? (
                    <div className="relative rounded-lg overflow-hidden border border-border/30">
                      <img
                        src={
                          selectedImage
                            ? URL.createObjectURL(selectedImage)
                            : restoredImageUrl || ""
                        }
                        alt="Selected"
                        className="object-cover w-full aspect-[4/3]"
                      />
                      <div className="flex gap-2 p-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
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
                            const url =
                              selectedImage
                                ? URL.createObjectURL(selectedImage)
                                : restoredImageUrl;
                            if (!url) return;
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "image.png";
                            a.click();
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
                </div>

                {/* Prompt + Style */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <Label htmlFor="prompt" className="text-base font-medium">
                      Prompt
                    </Label>
                    <Textarea
                      id="prompt"
                      placeholder="Describe what to generate..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isLoading || isRetrying}
                      className="mt-2 min-h-[120px]"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-1/2">
                      <Label htmlFor="style">Style</Label>
                      <Select
                        value={style}
                        onValueChange={setStyle}
                        disabled={isLoading || isRetrying}
                      >
                        <SelectTrigger id="style">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STYLE_OPTIONS.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1 flex justify-end gap-3">
                      <Button
                        onClick={handleGenerate}
                        disabled={
                          (isLoading || isRetrying) ||
                          (!selectedImage && !restoredImageUrl) ||
                          !prompt
                        }
                        className="flex items-center gap-2 bg-gradient-primary"
                      >
                        {isLoading || isRetrying ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" /> Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {(isLoading || isRetrying) && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setShowAbortDialog(true)}
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="mr-2 h-4 w-4" /> Abort
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Final Result Section */}
            {result && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative bg-card rounded-2xl border border-border/40 p-6 shadow-elegant"
                aria-labelledby="result-section"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    id="result-section"
                    className="text-2xl font-semibold flex items-center gap-2"
                  >
                    <Sparkles className="text-primary h-5 w-5" /> Final Result
                  </h3>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setResult(null);
                      toast({
                        title: "Workspace Cleared",
                        description: "Cleaned Workspace",
                      });
                    }}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <img
                      src={result.imageUrl}
                      alt={result.prompt}
                      className="rounded-xl border border-primary/20 shadow-md w-full"
                    />
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Prompt</div>
                      <div className="mt-1 break-words">{result.prompt}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Style</div>
                      <div className="mt-1 capitalize">{result.style}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Created</div>
                      <div className="mt-1">
                        {new Date(result.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </div>

          {/* History Sidebar */}
          <aside
            className="lg:col-span-1 bg-card rounded-2xl border border-border/40 p-4 shadow-elegant sticky top-24 flex flex-col max-h-[calc(100vh-8rem)] overflow-hidden"
            aria-label="Previous generations history"
          >
            <h3 className="text-lg font-semibold mb-3 flex-shrink-0">History</h3>

            <div className="flex-1 min-h-0 overflow-hidden">
              <GenerationHistory
                onSelect={handleHistorySelect}
                refreshTrigger={refreshHistory}
              />
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground flex-shrink-0">
              Tab or click an image to load it into the workspace.
            </p>
          </aside>
        </div>
      </main>

      {/* Abort Dialog */}
      <AbortConfirmationDialog
        open={showAbortDialog}
        onCancel={() => setShowAbortDialog(false)}
        onConfirm={() => {
          abort();
          toast({
            title: "Generation Aborted",
            description: "Process stopped.",
            variant: "destructive",
          });
          setShowAbortDialog(false);
        }}
      />
    </div>
  );
};

export default Studio;
