
import { Hierarchy, Parameter, Calculation, Patch, DeepSeekResponse } from '../types';

const SYSTEM_PROMPT = `You are a configuration copilot for industrial systems. You help users configure parameters and calculations for industrial products.

Your role:
- Analyze the current configuration context
- Suggest parameter optimizations
- Create relevant calculations
- Provide technical guidance
- Ensure all suggestions are within the current hierarchy context

Return JSON with keys:
- answer: conversational reply explaining your suggestions
- patch: array of Patch objects (see schema below)
- descriptionDraft: <25 words commit message for patches

Patch schema:
- For updates: { "action": "update", "id": "param_id", "field": "value"|"formula"|"description", "newValue": any }
- For new calculations: { "action": "create", "entity": "calculation", "payload": { id, name, formula, units, description } }

Never propose changes outside the current hierarchy.
Use id references exactly as provided.
Always validate formulas before suggesting them.`;

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  temperature: number;
  max_tokens: number;
  stream: boolean;
}

interface DeepSeekResponseData {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class DeepSeekAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'DeepSeekAPIError';
  }
}

export async function deepSeekChat(context: {
  hierarchy: Hierarchy;
  parameters: Parameter[];
  calculations: Calculation[];
  patches: Patch[];
}, userMessage: string): Promise<DeepSeekResponse> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  const baseUrl = import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
  const model = import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-chat';

  if (!apiKey) {
    throw new DeepSeekAPIError('DeepSeek API key not configured. Please set VITE_DEEPSEEK_API_KEY in your environment variables.');
  }

  // Build context message
  const contextMessage = buildContextMessage(context);
  
  const messages: DeepSeekMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: contextMessage },
    { role: 'user', content: userMessage }
  ];

  const requestBody: DeepSeekRequest = {
    model,
    messages,
    temperature: 0.7,
    max_tokens: 2000,
    stream: false
  };

  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new DeepSeekAPIError(
        `DeepSeek API error: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data: DeepSeekResponseData = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new DeepSeekAPIError('No response content received from DeepSeek API');
    }

    // Parse the response
    return parseDeepSeekResponse(content);

  } catch (error) {
    if (error instanceof DeepSeekAPIError) {
      throw error;
    }
    
    console.error('DeepSeek API call failed:', error);
    throw new DeepSeekAPIError('Failed to communicate with DeepSeek API. Please check your connection and try again.');
  }
}

function buildContextMessage(context: {
  hierarchy: Hierarchy;
  parameters: Parameter[];
  calculations: Calculation[];
  patches: Patch[];
}): string {
  const { hierarchy, parameters, calculations, patches } = context;

  let contextStr = 'Current Configuration Context:\n\n';

  // Hierarchy
  contextStr += 'Hierarchy:\n';
  if (hierarchy.industryId) contextStr += `- Industry: ${hierarchy.industryId}\n`;
  if (hierarchy.technologyId) contextStr += `- Technology: ${hierarchy.technologyId}\n`;
  if (hierarchy.solutionId) contextStr += `- Solution: ${hierarchy.solutionId}\n`;
  if (hierarchy.variantId) contextStr += `- Variant: ${hierarchy.variantId}\n`;

  // Parameters
  contextStr += '\nParameters:\n';
  parameters.forEach(param => {
    const value = param.value ?? param.defaultValue ?? 'N/A';
    contextStr += `- ${param.name} (${param.id}): ${value} ${param.units} [Level ${param.level}]\n`;
  });

  // Calculations
  if (calculations.length > 0) {
    contextStr += '\nCalculations:\n';
    calculations.forEach(calc => {
      const value = calc.value !== undefined ? calc.value.toFixed(2) : 'Error';
      contextStr += `- ${calc.name} (${calc.id}): ${calc.formula} = ${value} ${calc.units}\n`;
    });
  }

  // Recent patches
  if (patches.length > 0) {
    contextStr += '\nRecent Changes:\n';
    patches.slice(-5).forEach(patch => {
      if (patch.action === 'update') {
        contextStr += `- Updated ${patch.id}: ${patch.field} = ${patch.newValue}\n`;
      } else if (patch.action === 'create') {
        contextStr += `- Created calculation: ${patch.payload.name}\n`;
      }
    });
  }

  return contextStr;
}

function parseDeepSeekResponse(content: string): DeepSeekResponse {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        answer: content,
        descriptionDraft: 'AI response received'
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate the response structure
    if (typeof parsed.answer !== 'string') {
      throw new Error('Invalid response format: missing answer');
    }

    const result: DeepSeekResponse = {
      answer: parsed.answer
    };

    // Add optional fields if present
    if (parsed.patch && Array.isArray(parsed.patch)) {
      result.patch = parsed.patch;
    }

    if (parsed.descriptionDraft && typeof parsed.descriptionDraft === 'string') {
      result.descriptionDraft = parsed.descriptionDraft;
    }

    return result;

  } catch (error) {
    console.error('Failed to parse DeepSeek response:', error);
    
    // Return the raw content as answer if parsing fails
    return {
      answer: content,
      descriptionDraft: 'AI response received'
    };
  }
}

// Utility function to validate patches before applying
export function validatePatches(patches: Patch[], parameters: Parameter[], calculations: Calculation[]): {
  valid: Patch[];
  errors: string[];
} {
  const valid: Patch[] = [];
  const errors: string[] = [];

  patches.forEach((patch, index) => {
    try {
      if (patch.action === 'update') {
        // Validate parameter/calculation exists
        const param = parameters.find(p => p.id === patch.id);
        const calc = calculations.find(c => c.id === patch.id);
        
        if (!param && !calc) {
          errors.push(`Patch ${index + 1}: Entity with id '${patch.id}' not found`);
          return;
        }

        // Validate field
        if (!['value', 'formula', 'description'].includes(patch.field)) {
          errors.push(`Patch ${index + 1}: Invalid field '${patch.field}'`);
          return;
        }

        // Validate formula if it's a formula update
        if (patch.field === 'formula' && typeof patch.newValue === 'string') {
          try {
            // Basic formula validation - replace parameter references with dummy values
            let testFormula = patch.newValue;
            parameters.forEach(param => {
              testFormula = testFormula.replace(new RegExp(param.id, 'g'), '1');
            });
            calculations.forEach(calc => {
              testFormula = testFormula.replace(new RegExp(calc.id, 'g'), '1');
            });
            
            // Try to evaluate with dummy values
            const { evaluate } = require('mathjs');
            evaluate(testFormula);
          } catch (error) {
            errors.push(`Patch ${index + 1}: Invalid formula '${patch.newValue}'`);
            return;
          }
        }

        valid.push(patch);

      } else if (patch.action === 'create' && patch.entity === 'calculation') {
        // Validate calculation payload
        const calc = patch.payload;
        if (!calc.id || !calc.name || !calc.formula || !calc.units) {
          errors.push(`Patch ${index + 1}: Incomplete calculation payload`);
          return;
        }

        // Check for ID collision
        if (calculations.some(c => c.id === calc.id)) {
          errors.push(`Patch ${index + 1}: Calculation ID '${calc.id}' already exists`);
          return;
        }

        // Validate formula
        try {
          let testFormula = calc.formula;
          parameters.forEach(param => {
            testFormula = testFormula.replace(new RegExp(param.id, 'g'), '1');
          });
          
          const { evaluate } = require('mathjs');
          evaluate(testFormula);
        } catch (error) {
          errors.push(`Patch ${index + 1}: Invalid formula '${calc.formula}'`);
          return;
        }

        valid.push(patch);
      } else {
        errors.push(`Patch ${index + 1}: Invalid patch action`);
      }
    } catch (error) {
      errors.push(`Patch ${index + 1}: Validation error - ${error.message}`);
    }
  });

  return { valid, errors };
}
