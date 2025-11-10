import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { FileText, BookOpen, Lightbulb, History, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/history")}>
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Content Type Selection */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">What would you like to create?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card 
              className="p-8 cursor-pointer hover:shadow-xl transition-smooth border-2 hover:border-primary group"
              onClick={() => navigate("/generate/bio")}
            >
              <div className="w-14 h-14 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-smooth">
                <FileText className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Personal Bio</h3>
              <p className="text-muted-foreground mb-4">
                Create a professional bio for your CV, LinkedIn, or portfolio site.
              </p>
              <Button className="w-full" variant="outline">
                Create Bio
              </Button>
            </Card>

            <Card 
              className="p-8 cursor-pointer hover:shadow-xl transition-smooth border-2 hover:border-secondary group"
              onClick={() => navigate("/generate/project")}
            >
              <div className="w-14 h-14 rounded-lg gradient-secondary flex items-center justify-center mb-4 group-hover:shadow-glow transition-smooth">
                <BookOpen className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Project Summary</h3>
              <p className="text-muted-foreground mb-4">
                Generate a detailed summary of your project's goals and achievements.
              </p>
              <Button className="w-full" variant="outline">
                Create Summary
              </Button>
            </Card>

            <Card 
              className="p-8 cursor-pointer hover:shadow-xl transition-smooth border-2 hover:border-accent group"
              onClick={() => navigate("/generate/reflection")}
            >
              <div className="w-14 h-14 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:shadow-glow transition-smooth">
                <Lightbulb className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Learning Reflection</h3>
              <p className="text-muted-foreground mb-4">
                Transform your learning experiences into insightful reflections.
              </p>
              <Button className="w-full" variant="outline">
                Create Reflection
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;