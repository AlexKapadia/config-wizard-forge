
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, CheckCircle, Undo, AlertCircle, Loader2 } from 'lucide-react';
import { useParameterStore } from '../store/useParameterStore';
import { PendingChanges } from './PendingChanges';
import { useToast } from '@/hooks/use-toast';
import { deepSeekChat, validatePatches } from '../lib/deepseek';

interface CopilotSidebarProps {
  open: boolean;
  onToggle: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: Date;
  patches?: any[];
  error?: string;
}

export const CopilotSidebar: React.FC<CopilotSidebarProps> = ({ open, onToggle }) => {
  const { hierarchy, parameters, calculations, patches, applyPatch } = useParameterStore();
  const { toast } = useToast();
  
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPendingChanges, setShowPendingChanges] = React.useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call the real DeepSeek API
      const response = await deepSeekChat({
        hierarchy,
        parameters,
        calculations,
        patches
      }, input);

      // Validate patches if provided
      let validatedPatches = response.patch || [];
      if (validatedPatches.length > 0) {
        const validation = validatePatches(validatedPatches, parameters, calculations);
        validatedPatches = validation.valid;
        
        if (validation.errors.length > 0) {
          toast({
            title: "Validation Warnings",
            description: `Some suggestions had issues: ${validation.errors.join(', ')}`,
            variant: "destructive"
          });
        }
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        patches: validatedPatches
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Show success toast if patches were applied
      if (validatedPatches.length > 0) {
        toast({
          title: "AI Suggestions Ready",
          description: `Generated ${validatedPatches.length} suggestion(s). Click "Apply Changes" to implement them.`
        });
      }

    } catch (error: any) {
      console.error('DeepSeek API error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: `Sorry, I encountered an error: ${error.message || 'Unknown error occurred'}`,
        timestamp: new Date(),
        error: error.message
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "AI Copilot Error",
        description: error.message || "Failed to get AI response",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPatches = (patches: any[]) => {
    if (patches.length === 0) return;

    try {
      applyPatch(patches);
      toast({
        title: "Changes Applied",
        description: `Successfully applied ${patches.length} change(s)`
      });
    } catch (error: any) {
      toast({
        title: "Error Applying Changes",
        description: error.message || "Failed to apply changes",
        variant: "destructive"
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        onToggle();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onToggle]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed right-0 top-0 h-screen w-96 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-l border-white/20 shadow-xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex-shrink-0 p-4 border-b border-white/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">AI Copilot</h3>
              <Badge variant="secondary" className="text-xs">DeepSeek</Badge>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPendingChanges(!showPendingChanges)}
                className="text-xs"
              >
                Changes ({patches.length})
              </Button>
              <Button variant="ghost" size="sm" onClick={onToggle}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Pending Changes Drawer */}
          <AnimatePresence>
            {showPendingChanges && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="flex-shrink-0 border-b border-white/20 overflow-hidden"
              >
                <div className="max-h-32 overflow-y-auto">
                  <PendingChanges patches={patches} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Messages - Flexible height */}
          <div className="flex-1 min-h-0 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-4 pr-4">
                {messages.length === 0 && (
                  <Card className="bg-slate-50 dark:bg-slate-800 border-dashed">
                    <CardContent className="p-4 text-center">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-muted-foreground">
                        Ask me to help configure your industrial system. I can suggest parameter optimizations, create calculations, and provide technical guidance.
                      </p>
                      <div className="mt-3 text-xs text-muted-foreground">
                        <p>Try asking:</p>
                        <ul className="mt-1 space-y-1">
                          <li>• "Optimize the cooling efficiency"</li>
                          <li>• "Create a TCO calculation"</li>
                          <li>• "Suggest parameter improvements"</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${
                      message.type === 'user' 
                        ? 'ml-4 bg-primary text-primary-foreground' 
                        : message.type === 'error'
                        ? 'mr-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        : 'mr-4 bg-secondary'
                    } p-3 rounded-lg`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'error' && (
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        {message.patches && message.patches.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/20">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs"
                              onClick={() => handleApplyPatches(message.patches!)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Apply Changes ({message.patches.length})
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mr-4 bg-secondary p-3 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Input - Fixed at bottom */}
          <div className="flex-shrink-0 p-4 border-t border-white/20">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about your configuration..."
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage} 
                disabled={isLoading || !input.trim()}
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Press Ctrl + / to toggle • Enter to send • Shift + Enter for new line
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
