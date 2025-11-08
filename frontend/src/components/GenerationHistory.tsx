import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Clock } from 'lucide-react';
import { Generation } from '@/hooks/useGenerate';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface GenerationHistoryProps {
  onSelect: (generation: Generation) => void;
  refreshTrigger?: number;
}

const GenerationHistory = ({ onSelect, refreshTrigger }: GenerationHistoryProps) => {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchGenerations = async () => {
      if (!token) return;

      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3001/generations?limit=5', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch generations');
        const data = await response.json();
        setGenerations(data);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to load history',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenerations();
  }, [token, refreshTrigger, toast]);

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Recent Generations</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (generations.length === 0) {
    return (
      <Card className="h-full flex flex-col overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Recent Generations</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No generations yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Upload an image to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg">Recent Generations</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 p-0">
        <ScrollArea className="h-full">
          <TooltipProvider delayDuration={200}>
            <div className="space-y-4 p-3">
              {generations.map((generation) => (
                <Tooltip key={generation.id}>
                  <TooltipTrigger asChild>
                    {/* ⬇️ Image Card */}
                    <div
                      onClick={() => onSelect(generation)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelect(generation);
                        }
                      }}
                      className="
                        group cursor-pointer rounded-lg border border-border
                        hover:border-primary/40 transition-all overflow-hidden 
                        bg-card hover:shadow-elegant
                      "
                    >
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        <img
                          loading="lazy"
                          src={generation.imageUrl}
                          alt={generation.prompt}
                          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3 space-y-1">
                        <p className="text-sm font-medium line-clamp-2">
                          {generation.prompt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="capitalize">{generation.style}</span>
                          <span>{new Date(generation.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>

                  {/* 🧠 Tooltip only shows on hover, not focus */}
                  <TooltipContent
                    side="top"
                    className="text-xs text-muted-foreground bg-popover border border-border px-2 py-1 rounded-md shadow-sm"
                  >
                    Click to load into workspace
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GenerationHistory;
