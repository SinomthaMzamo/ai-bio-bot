import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, FileText, BookOpen, Lightbulb, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Generation {
  id: string;
  content_type: string;
  tone: string;
  generated_content: string;
  created_at: string;
}

const History = () => {
  const navigate = useNavigate();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGenerations();
  }, []);

  const fetchGenerations = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGenerations(data || []);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('generations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setGenerations(prev => prev.filter(g => g.id !== id));
      toast.success("Generation deleted");
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("Failed to delete generation");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "bio":
        return <FileText className="w-5 h-5" />;
      case "project":
        return <BookOpen className="w-5 h-5" />;
      case "reflection":
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "bio":
        return "Personal Bio";
      case "project":
        return "Project Summary";
      case "reflection":
        return "Learning Reflection";
      default:
        return "Content";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-subtle py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-8">Your Generation History</h1>

        {generations.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No generations yet</p>
            <Button onClick={() => navigate("/dashboard")}>
              Create Your First Generation
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {generations.map((generation) => (
              <Card 
                key={generation.id} 
                className="p-6 hover:shadow-lg transition-smooth cursor-pointer"
                onClick={() => navigate(`/result/${generation.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground">
                      {getIcon(generation.content_type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{getTypeLabel(generation.content_type)}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {generation.tone} • {new Date(generation.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-muted-foreground line-clamp-2">
                        {generation.generated_content.substring(0, 150)}...
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(generation.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;