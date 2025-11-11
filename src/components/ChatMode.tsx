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
  const [isSending, setIsSending] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const questions = CHAT_QUESTIONS[contentType];

  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      setTimeout(() => {
        askNextQuestion();
      }, 500);
    } else if (currentQuestionIndex === questions.length && Object.keys(formData).length === questions.length) {
      // Final confirmation message
      const summary = Object.entries(formData)
        .map(([key, value]) => `• ${key}: ${value}`)
        .join("\n");
      
      const confirmationMessage = userName
        ? `Perfect, ${userName}! Let me confirm what we have:\n\n${summary}\n\nLooks good? Click 'Generate Content' below!`
        : `Perfect! Let me confirm what we have:\n\n${summary}\n\nLooks good? Click 'Generate Content' below!`;
      
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: confirmationMessage
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

  const validateInput = (input: string, key: string): { isValid: boolean; feedback?: string } => {
    const trimmed = input.trim();
    
    if (trimmed.length < 10) {
      return { 
        isValid: false, 
        feedback: "That seems a bit short. Could you provide more details?" 
      };
    }
    
    // Check for placeholder-like responses
    const placeholderPatterns = /^(test|example|sample|n\/a|na|none|idk|i don't know)$/i;
    if (placeholderPatterns.test(trimmed)) {
      return { 
        isValid: false, 
        feedback: "I need real information to help you. Please share actual details." 
      };
    }
    
    return { isValid: true };
  };

  const handleSend = () => {
    if (!currentInput.trim() || currentQuestionIndex >= questions.length || isSending) return;

    const userMessage = currentInput.trim();
    const currentKey = questions[currentQuestionIndex].key;
    
    // Extract name from first question
    if (currentKey === "name" && !userName) {
      const extractedName = userMessage.split(" ")[0];
      setUserName(extractedName);
    }
    
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setCurrentInput("");
    setIsSending(true);
    
    // Validate input
    const validation = validateInput(userMessage, currentKey);
    
    setTimeout(() => {
      if (!validation.isValid) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: validation.feedback! 
        }]);
        setIsSending(false);
        return;
      }
      
      // Store the valid data
      setFormData((prev: any) => ({ ...prev, [currentKey]: userMessage }));
      
      // Acknowledgment without repetition
      const acknowledgments = userName 
        ? [
            `Thanks, ${userName}!`,
            `Perfect, ${userName}!`,
            `Great, ${userName}!`,
            `Got it, ${userName}!`
          ]
        : [
            "Thanks for that!",
            "Perfect!",
            "Great!",
            "Got it!"
          ];
      
      const randomAck = acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: randomAck
      }]);
      
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsSending(false);
      }, 600);
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
            onKeyDown={(e) => e.key === "Enter" && !isSending && handleSend()}
            placeholder="Type your answer..."
            disabled={isAsking || isSending}
          />
          <Button onClick={handleSend} disabled={isAsking || isSending || !currentInput.trim()}>
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
