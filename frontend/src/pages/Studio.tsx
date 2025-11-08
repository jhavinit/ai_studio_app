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
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

  const { generate, abort, isLoading, error } = useGenerate({
    onSuccess: (generation) => {
      setResult(generation);
      setRefreshHistory((prev) => prev + 1);

      setSelectedImage(null);
      setRestoredImageUrl(null);
      setPrompt("");
      setStyle("photorealistic");

      toast({
        title: "Generation Complete",
        description:
          "Your image has been generated and added to history successfully.",
      });
    },
    onError: () => { },
  });

  const { executeWithRetry, retryCount, isRetrying } = useRetry<Generation>({
    maxRetries: 3,
    onError: (errMsg) => {
      toast({
        title: "Generation Failed",
        description: errMsg,
        variant: "destructive",
      });
    },
    onMaxRetriesReached: () => {
      toast({
        title: "Max Retries Reached",
        description:
          "The model is currently overloaded. Please try again later.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const urlToFile = async (url: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const ext = (blob.type && blob.type.split("/")[1]) || "jpg";
    const filename = `restored.${ext}`;
    return new File([blob], filename, { type: blob.type });
  };

  const handleGenerate = async () => {
    if (!selectedImage && !restoredImageUrl) {
      toast({
        title: "Missing Image",
        description: "Please upload an image or choose one from history.",
        variant: "destructive",
      });
      return;
    }
    if (!prompt || !style) {
      toast({
        title: "Missing Input",
        description: "Please enter a prompt and select a style.",
        variant: "destructive",
      });
      return;
    }

    try {
      let fileToSend: File | null = selectedImage;
      if (!fileToSend && restoredImageUrl) {
        fileToSend = await urlToFile(restoredImageUrl);
      }

      await executeWithRetry(() =>
        generate(fileToSend as File, prompt, style)
      );
    } catch {
      toast({
        title: "Generation Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleHistorySelect = (generation: Generation) => {
    setRestoredImageUrl(generation.imageUrl);
    setPrompt(generation.prompt);
    setStyle(generation.style);
    setResult(generation);
    toast({
      title: "Loaded from history",
      description:
        "This generation is loaded into the workspace — you can tweak prompt or style and re-run.",
    });
  };

  const handleClearWorkspace = () => {
    setSelectedImage(null);
    setRestoredImageUrl(null);
    setPrompt("");
    setStyle("photorealistic");
    setResult(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Studio
            </h1>
            <span className="text-xs text-muted-foreground ml-2">
              Mini AI Studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">{user?.email}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearWorkspace}
              title="Clear workspace"
            >
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
          {/* Left side: workspace */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl border border-border/40 p-6 shadow-elegant">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Create Generation</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload or restore an image, enter a prompt, and choose a
                    style.
                  </p>
                </div>
                {(isLoading || isRetrying) && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="animate-spin w-4 h-4" />
                    {retryCount > 0
                      ? `Retrying (${retryCount}/3)...`
                      : "Generating..."}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload section */}
                <div className="lg:col-span-1">
                  <Label className="text-base font-medium mb-3 block">
                    Image
                  </Label>
                  {selectedImage || restoredImageUrl ? (
                    <div className="relative rounded-lg overflow-hidden border border-border/30">
                      <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
                        <img
                          src={
                            selectedImage
                              ? URL.createObjectURL(selectedImage)
                              : restoredImageUrl || ""
                          }
                          alt="Selected"
                          className="object-cover w-full h-full"
                        />
                      </div>

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
                            const url = selectedImage
                              ? URL.createObjectURL(selectedImage)
                              : restoredImageUrl;
                            if (!url) return;
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "image.png";
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
                </div>

                {/* Prompt + Style */}
                <div className="lg:col-span-2 space-y-4">
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
                      className="mt-2 min-h-[120px]"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-1/2">
                      <Label
                        htmlFor="style"
                        className="text-base font-medium mb-2 block"
                      >
                        Style
                      </Label>
                      <Select
                        value={style}
                        onValueChange={(val) => setStyle(val)}
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
                            {retryCount > 0
                              ? `Retrying (${retryCount}/3)...`
                              : "Generating..."}
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {(isLoading || isRetrying) && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => setShowAbortDialog(true)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Abort Generation
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Result Section */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-card rounded-2xl border border-border/40 p-6 shadow-elegant"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                      <Sparkles className="text-primary h-5 w-5" />
                      Final Result
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      You can download or re-use this as a new base.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = result.imageUrl;
                        a.download = "generation.png";
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => {
                        setRestoredImageUrl(result.imageUrl);
                        setPrompt(result.prompt);
                        setStyle(result.style);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Re-Use
                    </Button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <div className="lg:col-span-2">
                    <div className="rounded-xl overflow-hidden border border-primary/20 shadow-md">
                      <img
                        src={result.imageUrl}
                        alt={result.prompt}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Prompt</div>
                      <div className="mt-1 text-sm break-words">
                        {result.prompt}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Style</div>
                      <div className="mt-1 text-sm capitalize">
                        {result.style}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Created</div>
                      <div className="mt-1 text-sm">
                        {new Date(result.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* History */}
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
                        <span>
                          {new Date(g.createdAt).toLocaleDateString()}
                        </span>
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

      {/* Abort Confirmation Dialog */}
      <AbortConfirmationDialog
        open={showAbortDialog}
        onCancel={() => setShowAbortDialog(false)}
        onConfirm={() => {
          abort();
          toast({
            title: "Generation Aborted",
            description: "You stopped the current process.",
            variant: "destructive",
          });
        }}
      />
    </div>
  );
};

export default Studio;
