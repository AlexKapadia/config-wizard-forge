
import { Hierarchy, Parameter, Calculation, Patch, DeepSeekResponse } from '../types';

const SYSTEM_PROMPT = `You are a configuration copilot for industrial systems.
Return JSON with keys:
- answer: conversational reply
- patch: array of Patch objects (see schema).
- descriptionDraft: <25 words commit message for patches.
Never propose changes outside the current hierarchy.
Use id references exactly as provided.`;

export async function deepSeekChat(context: {
  hierarchy: Hierarchy;
  parameters: Parameter[];
  calculations: Calculation[];
  patches: Patch[];
}, userMessage: string): Promise<DeepSeekResponse> {
  // Mock implementation - replace with actual DeepSeek API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockResponses = [
        {
          answer: "I can help you optimize your cooling system configuration. Based on the current parameters, I notice you might want to calculate the total cooling efficiency.",
          patch: [{
            action: "create" as const,
            entity: "calculation" as const,
            payload: {
              id: `calc-${Date.now()}`,
              name: "Cooling Efficiency",
              formula: "cooling_load / power_consumption",
              units: "kW/kW",
              description: "Overall system cooling efficiency ratio"
            }
          }],
          descriptionDraft: "Added cooling efficiency calculation"
        },
        {
          answer: "Let me suggest some improvements to your air cooling system. The air flow rate could be optimized based on the cooling load.",
          patch: [{
            action: "update" as const,
            id: context.parameters.find(p => p.name.includes('Air Flow'))?.id || '',
            field: "value" as const,
            newValue: 1500
          }],
          descriptionDraft: "Optimized air flow rate"
        },
        {
          answer: "Your current configuration looks good. The temperature setpoints are within recommended ranges for data center cooling."
        }
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      resolve(randomResponse);
    }, 1000 + Math.random() * 2000);
  });
}
