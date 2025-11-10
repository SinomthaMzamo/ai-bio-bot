import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

type ContentType = "bio" | "project" | "reflection";

interface FormData {
  [key: string]: string;
}

const Generate = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: ContentType }>();
  const [isLoading, setIsLoading] = useState(false);
  const [tone, setTone] = useState<"first-person" | "third-person">("first-person");
  const [wordLimit, setWordLimit] = useState("500");
  const [formData, setFormData] = useState<FormData>({});

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  const getFormFields = () => {
    switch (type) {
      case "bio":
        return [
          { name: "name", label: "Full Name", type: "input", placeholder: "John Doe" },
          { name: "skills", label: "Key Skills", type: "textarea", placeholder: "List your main skills and expertise..." },
          { name: "experience", label: "Professional Experience", type: "textarea", placeholder: "Describe your work experience..." },
          { name: "achievements", label: "Notable Achievements", type: "textarea", placeholder: "Highlight your key accomplishments..." },
        ];
      case "project":
        return [
          { name: "projectName", label: "Project Name", type: "input", placeholder: "My Awesome Project" },
          { name: "objective", label: "Project Objective", type: "textarea", placeholder: "What was the goal of this project?" },
          { name: "technologies", label: "Technologies Used", type: "textarea", placeholder: "List the technologies and tools..." },
          { name: "achievements", label: "Key Achievements", type: "textarea", placeholder: "What did you accomplish?" },
          { name: "impact", label: "Impact & Results", type: "textarea", placeholder: "What was the impact of your work?" },
        ];
      case "reflection":
        return [
          { name: "topic", label: "Learning Topic", type: "input", placeholder: "Machine Learning Fundamentals" },
          { name: "context", label: "Learning Context", type: "textarea", placeholder: "Where and how did you learn this?" },
          { name: "keyLearnings", label: "Key Learnings", type: "textarea", placeholder: "What were your main takeaways?" },
          { name: "challenges", label: "Challenges Faced", type: "textarea", placeholder: "What difficulties did you encounter?" },
          { name: "application", label: "Future Application", type: "textarea", placeholder: "How will you apply this knowledge?" },
        ];
      default:
        return [];
    }
  };

  const getTitle = () => {
    switch (type) {
      case "bio":
        return "Create Personal Bio";
      case "project":
        return "Create Project Summary";
      case "reflection":
        return "Create Learning Reflection";
      default:
        return "Create Content";
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const fields = getFormFields();
    for (const field of fields) {
      if (!formData[field.name]?.trim()) {
        toast.error(`Please fill in the ${field.label} field`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to continue");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { 
          contentType: type,
          tone,
          wordLimit: parseInt(wordLimit),
          inputData: formData
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      // Save to database
      const { data: generation, error: dbError } = await supabase
        .from('generations')
        .insert({
          user_id: session.user.id,
          content_type: type,
          tone,
          word_limit: parseInt(wordLimit),
          input_data: formData,
          generated_content: data.content
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success("Content generated successfully!");
      navigate(`/result/${generation.id}`);
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to generate content");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-subtle py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-8">{getTitle()}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tone Selection */}
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(value: any) => setTone(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first-person">First Person (I, my, me)</SelectItem>
                  <SelectItem value="third-person">Third Person (He, she, they)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Word Limit */}
            <div className="space-y-2">
              <Label htmlFor="wordLimit">Word Limit</Label>
              <Input
                id="wordLimit"
                type="number"
                min="100"
                max="1000"
                value={wordLimit}
                onChange={(e) => setWordLimit(e.target.value)}
              />
            </div>

            {/* Dynamic Form Fields */}
            {getFormFields().map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === "input" ? (
                  <Input
                    id={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    required
                  />
                ) : (
                  <Textarea
                    id={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    rows={4}
                    required
                  />
                )}
              </div>
            ))}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Content"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Generate;