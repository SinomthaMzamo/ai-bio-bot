import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FileText, BookOpen, Lightbulb, Sparkles } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Professional Content</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Transform Your Ideas Into
              <span className="block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Professional Content
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Generate polished bios, project summaries, and learning reflections in seconds. 
              Powered by advanced AI, refined by you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 shadow-glow"
                onClick={() => navigate("/auth")}
              >
                Get Started For Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What You Can Create</h2>
          <p className="text-muted-foreground text-lg">Choose from three powerful content types</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 hover:shadow-lg transition-smooth border-2">
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">Personal Bios</h3>
            <p className="text-muted-foreground">
              Craft compelling professional bios for your CV, LinkedIn, or portfolio. 
              Choose between first-person and third-person perspectives.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-smooth border-2">
            <div className="w-12 h-12 rounded-lg gradient-secondary flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">Project Summaries</h3>
            <p className="text-muted-foreground">
              Transform project details into polished summaries that highlight 
              achievements, technologies, and impact.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-smooth border-2">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">Learning Reflections</h3>
            <p className="text-muted-foreground">
              Convert learning experiences into thoughtful reflections that 
              showcase growth, insights, and skill development.
            </p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <Card className="relative overflow-hidden p-12 gradient-hero text-primary-foreground text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Professional Content?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of professionals using AI to enhance their content
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8"
            onClick={() => navigate("/auth")}
          >
            Start Creating Now
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Landing;