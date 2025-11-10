import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Download, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Generation {
  id: string;
  content_type: string;
  tone: string;
  generated_content: string;
  created_at: string;
}

const Result = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGeneration = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/auth");
          return;
        }

        const { data, error } = await supabase
          .from('generations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setGeneration(data);
      } catch (error: any) {
        console.error("Fetch error:", error);
        toast.error("Failed to load generation");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGeneration();
  }, [id, navigate]);

  const handleDownloadMarkdown = () => {
    if (!generation) return;
    
    const blob = new Blob([generation.generated_content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generation.content_type}-${new Date().getTime()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded as Markdown");
  };

  const handleDownloadText = () => {
    if (!generation) return;
    
    const blob = new Blob([generation.generated_content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generation.content_type}-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded as Text");
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

  if (!generation) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-subtle py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadMarkdown}>
              <Download className="w-4 h-4 mr-2" />
              Markdown
            </Button>
            <Button variant="outline" onClick={handleDownloadText}>
              <Download className="w-4 h-4 mr-2" />
              Text
            </Button>
          </div>
        </div>

        <Card className="p-8">
          <div className="mb-6 pb-6 border-b">
            <h1 className="text-3xl font-bold mb-2">{getTypeLabel(generation.content_type)}</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Tone: {generation.tone}</span>
              <span>•</span>
              <span>Generated: {new Date(generation.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <ReactMarkdown>{generation.generated_content}</ReactMarkdown>
          </div>

          <div className="mt-8 pt-6 border-t flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/generate/${generation.content_type}`)}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              Create New {getTypeLabel(generation.content_type)}
            </Button>
            <Button 
              onClick={() => navigate("/history")}
              className="flex-1"
            >
              View All Generations
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Result;