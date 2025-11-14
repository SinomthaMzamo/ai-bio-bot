import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Edit2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface ChatModeProps {
  contentType: "bio" | "project" | "reflection";
  onComplete: (formData: any) => void;
  isGenerating?: boolean;
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

export const ChatMode = ({ contentType, onComplete, isGenerating = false }: ChatModeProps) => {
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
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [showRefinement, setShowRefinement] = useState(false);
  const [isEditingField, setIsEditingField] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const questions = CHAT_QUESTIONS[contentType];

  useEffect(() => {
    if (currentQuestionIndex < questions.length && !isEditingField) {
      setTimeout(() => {
        askNextQuestion();
      }, 500);
    } else if (currentQuestionIndex === questions.length && Object.keys(formData).length === questions.length && !showRefinement) {
      // Generate natural summary using AI
      generateConfirmationSummary();
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateConfirmationSummary = async () => {
    setIsLoadingSummary(true);
    
    // Remove any previous confirmation messages to avoid duplicates
    setMessages(prev => prev.filter(msg => 
      !(msg.role === "assistant" && msg.content.includes("Does this look good"))
    ));
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/summarize-info`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
          },
          body: JSON.stringify({ 
            formData,
            contentType 
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const { summary } = await response.json();
      
      const confirmationMessage = userName
        ? `Perfect, ${userName}! Let me confirm what we have:\n\n${summary}\n\nDoes this look good, or would you like to refine anything?`
        : `Perfect! Let me confirm what we have:\n\n${summary}\n\nDoes this look good, or would you like to refine anything?`;
      
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: confirmationMessage
        }
      ]);
      setShowRefinement(true);
    } catch (error) {
      console.error('Summary generation error:', error);
      // Fallback to simple summary
      const summary = Object.entries(formData)
        .map(([key, value]) => `• ${key}: ${value}`)
        .join("\n");
      
      const confirmationMessage = userName
        ? `Perfect, ${userName}! Let me confirm what we have:\n\n${summary}\n\nDoes this look good, or would you like to refine anything?`
        : `Perfect! Let me confirm what we have:\n\n${summary}\n\nDoes this look good, or would you like to refine anything?`;
      
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: confirmationMessage
        }
      ]);
      setShowRefinement(true);
    } finally {
      setIsLoadingSummary(false);
    }
  };

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

  const handleRefineField = (fieldKey: string) => {
    const questionIndex = questions.findIndex(q => q.key === fieldKey);
    if (questionIndex !== -1) {
      setCurrentQuestionIndex(questionIndex);
      setShowRefinement(false);
      setIsEditingField(true);
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: `Let's update that. ${questions[questionIndex].question}` 
        }
      ]);
    }
  };

  const validateInput = async (input: string, question: string): Promise<{ isValid: boolean; feedback?: string; acknowledgment?: string }> => {
    const trimmed = input.trim();
    
    // Basic length check
    if (trimmed.length < 3) {
      return { 
        isValid: false, 
        feedback: "That seems too short. Could you provide more details?" 
      };
    }
    
    try {
      // AI-powered semantic validation
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-answer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
          },
          body: JSON.stringify({ 
            question,
            answer: trimmed 
          })
        }
      );

      if (!response.ok) {
        console.error('Validation failed, accepting input');
        return { isValid: true };
      }

      const validation = await response.json();
      return validation;
    } catch (error) {
      console.error('Validation error:', error);
      // Fallback: accept input if validation service fails
      return { isValid: true };
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isSending && currentInput.trim()) {
        handleSend();
      }
    }
  };

  const handleSend = async () => {
    if (!currentInput.trim() || isSending) return;
    
    // If we're in refinement mode, allow updating
    if (showRefinement && currentQuestionIndex >= questions.length) {
      return;
    }
    
    if (currentQuestionIndex >= questions.length) return;

    let userMessage = currentInput.trim();
    const currentKey = questions[currentQuestionIndex].key;
    const currentQuestion = questions[currentQuestionIndex].question;
    
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setCurrentInput("");
    setIsSending(true);
    
    // Check if user wants to keep existing value (only when editing)
    if (isEditingField && formData[currentKey]) {
      const keepSamePatterns = [
        /keep.*same/i,
        /no.*change/i,
        /remain.*same/i,
        /as.*before/i,
        /don't.*change/i,
        /stay.*same/i,
        /^same$/i,
        /^keep$/i,
        /that's.*fine/i,
        /^ok$/i
      ];
      
      const wantsToKeep = keepSamePatterns.some(pattern => pattern.test(userMessage));
      
      if (wantsToKeep) {
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: "assistant", 
            content: userName 
              ? `Got it, ${userName}! We'll keep that as is.`
              : "Got it! We'll keep that as is."
          }]);
          
          setTimeout(() => {
            setIsEditingField(false);
            setCurrentQuestionIndex(questions.length);
            generateConfirmationSummary();
            setIsSending(false);
          }, 600);
        }, 400);
        return;
      }
      
      // Check if user wants to add to existing value or replace it
      const additivePatterns = [
        /\balso\b/i,
        /\band\b/i,
        /additionally/i,
        /\bplus\b/i,
        /as well/i,
        /\btoo\b/i,
        /furthermore/i,
        /moreover/i
      ];
      
      const replacementPatterns = [
        /actually/i,
        /change.*to/i,
        /replace.*with/i,
        /instead/i,
        /rather than/i,
        /not.*but/i
      ];
      
      const wantsToAdd = additivePatterns.some(pattern => pattern.test(userMessage));
      const wantsToReplace = replacementPatterns.some(pattern => pattern.test(userMessage));
      
      // If additive language detected and no replacement language, append to existing
      if (wantsToAdd && !wantsToReplace) {
        userMessage = `${formData[currentKey]}. ${userMessage}`;
      }
      // Otherwise replace (either explicit replacement or unclear intent)
    }
    
    // Validate input with AI
    const validation = await validateInput(userMessage, currentQuestion);
    
    if (!validation.isValid) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: validation.feedback! 
      }]);
      setIsSending(false);
      return;
    }
    
    // Extract name from first question if it's a name field
    if (currentKey === "name" && !userName) {
      const extractedName = userMessage.split(" ")[0];
      setUserName(extractedName);
    }
    
    // Store the valid data
    setFormData((prev: any) => ({ ...prev, [currentKey]: userMessage }));
    
    // Use AI-provided acknowledgment or fallback to generic ones
    let acknowledgment = validation.acknowledgment;
    
    if (!acknowledgment) {
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
      acknowledgment = acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
    }
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: acknowledgment
      }]);
      
      setTimeout(() => {
        // If we're editing a field, go back to confirmation instead of continuing
        if (isEditingField) {
          setIsEditingField(false);
          setCurrentQuestionIndex(questions.length);
          // useEffect will handle calling generateConfirmationSummary
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
        }
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
                {message.role === "assistant" && message.content.includes("Does this look good") ? (
                  <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}
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

      {isLoadingSummary && (
        <div className="flex justify-start">
          <Card className="bg-muted p-4">
            <Loader2 className="w-4 h-4 animate-spin" />
          </Card>
        </div>
      )}

      {currentQuestionIndex < questions.length ? (
        <div className="flex gap-2 mt-4">
          <Textarea
            ref={textareaRef}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer... (Shift+Enter for new line)"
            disabled={isAsking || isSending}
            className="min-h-[80px] resize-none"
            rows={3}
          />
          <Button onClick={handleSend} disabled={isAsking || isSending || !currentInput.trim()}>
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      ) : showRefinement ? (
        <div className="space-y-3 mt-4">
          <div className="flex flex-wrap gap-2">
            {questions.map((q) => (
              <Button
                key={q.key}
                variant="outline"
                size="sm"
                onClick={() => handleRefineField(q.key)}
                className="text-xs"
              >
                <Edit2 className="w-3 h-3 mr-1" />
                Edit {q.key}
              </Button>
            ))}
          </div>
          <Button 
            onClick={handleGenerate} 
            size="lg" 
            className="w-full"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Content"
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
