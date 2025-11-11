import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Download, Loader2, FileText, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";

interface Generation {
  id: string;
  content_type: string;
  tone: string;
  word_limit: number;
  input_data: any;
  generated_content: string;
  created_at: string;
}

const Result = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefining, setIsRefining] = useState(false);
  const [refinementPrompt, setRefinementPrompt] = useState("");
  const [showRefinement, setShowRefinement] = useState(false);

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

  const handleRefine = async () => {
    if (!refinementPrompt.trim()) {
      toast.error("Please enter refinement instructions");
      return;
    }

    setIsRefining(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { 
          contentType: generation?.content_type,
          tone: generation?.tone,
          wordLimit: generation?.word_limit,
          inputData: {
            existingContent: generation?.generated_content
          },
          refinementPrompt: refinementPrompt
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (!data?.content) {
        throw new Error("No content received from AI");
      }

      // Update the generation with new content
      const { error: updateError } = await supabase
        .from('generations')
        .update({ generated_content: data.content })
        .eq('id', id);

      if (updateError) throw updateError;

      setGeneration(prev => prev ? { ...prev, generated_content: data.content } : null);
      setRefinementPrompt("");
      setShowRefinement(false);
      toast.success("Content refined successfully!");
    } catch (error: any) {
      console.error("Refinement error:", error);
      toast.error(error.message || "Failed to refine content");
    } finally {
      setIsRefining(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generation) return;
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      
      // Add title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      const title = getTypeLabel(generation.content_type);
      doc.text(title, margin, 20);
      
      // Add content
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(generation.generated_content, maxWidth);
      doc.text(lines, margin, 35);
      
      // Save
      const filename = `${generation.content_type}-${Date.now()}.pdf`;
      doc.save(filename);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF");
    }
  };

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

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={handleDownloadMarkdown}>
              <Download className="w-4 h-4 mr-2" />
              Markdown
            </Button>
            <Button variant="outline" onClick={handleDownloadText}>
              <Download className="w-4 h-4 mr-2" />
              Text
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowRefinement(!showRefinement)}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refine
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

          {showRefinement && (
            <div className="mb-6 p-6 bg-muted rounded-lg">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="refinement" className="text-base font-semibold">Refinement Instructions</Label>
                  <Textarea
                    id="refinement"
                    placeholder="E.g., Make it more professional, add more details about leadership skills, focus on technical achievements..."
                    value={refinementPrompt}
                    onChange={(e) => setRefinementPrompt(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleRefine} disabled={isRefining}>
                    {isRefining ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Refining...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Apply Refinement
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowRefinement(false);
                      setRefinementPrompt("");
                    }} 
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

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