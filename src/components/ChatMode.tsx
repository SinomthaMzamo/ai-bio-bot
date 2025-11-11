import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface ChatModeProps {
  contentType: "bio" | "project" | "reflection";
  onComplete: (formData: any) => void;
}

const CHAT_QUESTIONS = {
  bio: [
    { key: "name", question: "What's your full name?" },
    { key: "skills", question: "What are your key skills and areas of expertise?" },
    { key: "experience", question: "Tell me about your professional experience." },
    { key: "achievements", question: "What are some of your notable achievements?" }
  ],
  project: [
    { key: "projectName", question: "What's the name of your project?" },
    { key: "objective", question: "What was the main objective of this project?" },
    { key: "technologies", question: "What technologies and tools did you use?" },
    { key: "achievements", question: "What were the key achievements in this project?" },
    { key: "impact", question: "What impact did your project have?" }
  ],
  reflection: [
    { key: "topic", question: "What topic did you learn about?" },
    { key: "context", question: "Where and how did you learn this?" },
    { key: "keyLearnings", question: "What were your main takeaways?" },
    { key: "challenges", question: "What challenges did you face?" },
    { key: "application", question: "How will you apply this knowledge in the future?" }
  ]
};

export const ChatMode = ({ contentType, onComplete }: ChatModeProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hi! I'll help you create your content. Let's start with some questions." 
    }
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [isAsking, setIsAsking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const questions = CHAT_QUESTIONS[contentType];

  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      setTimeout(() => {
        askNextQuestion();
      }, 500);
    } else if (currentQuestionIndex === questions.length && Object.keys(formData).length === questions.length) {
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: "Perfect! I have all the information I need. Click 'Generate Content' below to create your content." 
        }
      ]);
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const askNextQuestion = () => {
    if (currentQuestionIndex < questions.length) {
      setIsAsking(true);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: questions[currentQuestionIndex].question }
        ]);
        setIsAsking(false);
      }, 300);
    }
  };

  const handleSend = () => {
    if (!currentInput.trim() || currentQuestionIndex >= questions.length) return;

    const userMessage = currentInput.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    
    const currentKey = questions[currentQuestionIndex].key;
    setFormData((prev: any) => ({ ...prev, [currentKey]: userMessage }));
    
    setCurrentInput("");
    
    // Add acknowledgment message
    setTimeout(() => {
      const acknowledgments = [
        "Got it! That's really helpful.",
        "Perfect, I've noted that down.",
        "Excellent! Thanks for sharing that.",
        "Great! I have a clear picture now.",
        "Wonderful! That gives me good context."
      ];
      const randomAck = acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `${randomAck} Let me just confirm: "${userMessage}"`
      }]);
      
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 800);
    }, 400);
  };

  const handleGenerate = () => {
    onComplete(formData);
  };

  return (
    <div className="flex flex-col h-[600px]">
      <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
        <div className="space-y-4 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[80%] p-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </Card>
            </div>
          ))}
          {isAsking && (
            <div className="flex justify-start">
              <Card className="bg-muted p-4">
                <Loader2 className="w-4 h-4 animate-spin" />
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {currentQuestionIndex < questions.length ? (
        <div className="flex gap-2 mt-4">
          <Input
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your answer..."
            disabled={isAsking}
          />
          <Button onClick={handleSend} disabled={isAsking || !currentInput.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button onClick={handleGenerate} size="lg" className="w-full mt-4">
          Generate Content
        </Button>
      )}
    </div>
  );
};
