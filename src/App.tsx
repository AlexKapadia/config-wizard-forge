
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WizardLayout } from "./components/WizardLayout";
import { Step1 } from "./pages/wizard/Step1";
import { Step2 } from "./pages/wizard/Step2";
import { Step3 } from "./pages/wizard/Step3";
import { Step4 } from "./pages/wizard/Step4";
import { Step5 } from "./pages/wizard/Step5";
import { ReviewPage } from "./pages/ReviewPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/wizard/step/1" replace />} />
          <Route path="/wizard" element={<WizardLayout />}>
            <Route path="step/1" element={<Step1 />} />
            <Route path="step/2" element={<Step2 />} />
            <Route path="step/3" element={<Step3 />} />
            <Route path="step/4" element={<Step4 />} />
            <Route path="step/5" element={<Step5 />} />
          </Route>
          <Route path="/review" element={<ReviewPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
