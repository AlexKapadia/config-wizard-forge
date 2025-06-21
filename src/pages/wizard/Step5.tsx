
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { ParamGrid } from '../../components/ParamGrid';
import { CalcGrid } from '../../components/CalcGrid';
import { CopilotSidebar } from '../../components/CopilotSidebar';
import { StepFooter } from '../../components/StepFooter';
import { motion } from 'framer-motion';

export const Step5: React.FC = () => {
  const [copilotOpen, setCopilotOpen] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between sticky top-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 z-10 pb-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Product Builder</h2>
          <p className="text-muted-foreground">
            Configure parameters and create calculations for your system
          </p>
        </div>
        <Button
          onClick={() => setCopilotOpen(true)}
          className="flex items-center space-x-2"
        >
          <MessageCircle className="h-4 w-4" />
          <span>AI Copilot</span>
        </Button>
      </div>

      <div className="flex-1">
        <Tabs defaultValue="parameters" className="w-full h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="calculations">Calculations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="parameters" className="mt-6">
            <ParamGrid />
          </TabsContent>
          
          <TabsContent value="calculations" className="mt-6">
            <CalcGrid />
          </TabsContent>
        </Tabs>
      </div>

      <StepFooter currentStep={5} />

      <CopilotSidebar
        open={copilotOpen}
        onToggle={() => setCopilotOpen(!copilotOpen)}
      />
    </motion.div>
  );
};
