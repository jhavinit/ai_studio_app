import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Clock } from 'lucide-react';
import { Generation } from '@/hooks/useGenerate';
import { useToast } from '@/hooks/use-toast';

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
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch generations');
        }

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
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Recent Generations</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (generations.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Recent Generations</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 text-center">
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Recent Generations</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {generations.map((generation) => (
              <div
                key={generation.id}
                onClick={() => onSelect(generation)}
                className="group cursor-pointer rounded-lg border border-border hover:border-primary/50 transition-all overflow-hidden bg-card hover:shadow-elegant"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img
                    loading="lazy"
                    src={generation.imageUrl}
                    alt={generation.prompt}
                    className="w-full aspect-square object-cover rounded-md transform transition-transform duration-300 hover:scale-105"
                  // className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GenerationHistory;
