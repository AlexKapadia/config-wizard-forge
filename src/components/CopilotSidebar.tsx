
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, CheckCircle, Undo } from 'lucide-react';
import { useParameterStore } from '../store/useParameterStore';
import { deepSeekChat } from '../lib/deepseek';
import { PendingChanges } from './PendingChanges';
import { useToast } from '@/hooks/use-toast';

interface CopilotSidebarProps {
  open: boolean;
  onToggle: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  patches?: any[];
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
      const response = await deepSeekChat({
        hierarchy,
        parameters,
        calculations,
        patches
      }, input);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        patches: response.patch
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (response.patch && response.patch.length > 0) {
        toast({
          title: "Suggestions Available",
          description: response.descriptionDraft || "The AI has suggested some changes",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPatches = (patches: any[]) => {
    applyPatch(patches);
    toast({
      title: "Changes Applied",
      description: `Applied ${patches.length} change(s) successfully`
    });
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        onToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed right-0 top-0 h-full w-96 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-l border-white/20 shadow-xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">AI Copilot</h3>
              <Badge variant="secondary" className="text-xs">Beta</Badge>
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
                className="border-b border-white/20 overflow-hidden"
              >
                <PendingChanges patches={patches} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <Card className="bg-slate-50 dark:bg-slate-800 border-dashed">
                  <CardContent className="p-4 text-center">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      Ask me anything about your configuration. I can help optimize parameters and create calculations.
                    </p>
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
                      : 'mr-4 bg-secondary'
                  } p-3 rounded-lg`}
                >
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
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mr-4 bg-secondary p-3 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">Thinking...</span>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-white/20">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your configuration..."
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isLoading}
              />
              <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Ctrl+/ to toggle sidebar
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
