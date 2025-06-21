
import { deepSeekChat } from '../lib/deepseek';
import { Hierarchy, Parameter, Calculation, Patch } from '../types';

describe('DeepSeek Adapter', () => {
  const mockContext = {
    hierarchy: { industryId: 'datacenter', technologyId: 'cooling' } as Hierarchy,
    parameters: [] as Parameter[],
    calculations: [] as Calculation[],
    patches: [] as Patch[]
  };

  test('returns structured response', async () => {
    const response = await deepSeekChat(mockContext, 'Help me optimize cooling');
    
    expect(response).toHaveProperty('answer');
    expect(typeof response.answer).toBe('string');
    expect(response.answer.length).toBeGreaterThan(0);
  });

  test('may include patches in response', async () => {
    const response = await deepSeekChat(mockContext, 'Create a calculation');
    
    if (response.patch) {
      expect(Array.isArray(response.patch)).toBe(true);
      expect(response.patch.length).toBeGreaterThan(0);
    }
  });

  test('handles empty context gracefully', async () => {
    const emptyContext = {
      hierarchy: {} as Hierarchy,
      parameters: [],
      calculations: [],
      patches: []
    };

    const response = await deepSeekChat(emptyContext, 'Hello');
    
    expect(response).toHaveProperty('answer');
    expect(typeof response.answer).toBe('string');
  });

  test('response time is reasonable', async () => {
    const startTime = Date.now();
    await deepSeekChat(mockContext, 'Quick question');
    const duration = Date.now() - startTime;
    
    // Should respond within 5 seconds (including random delay)
    expect(duration).toBeLessThan(5000);
  });
});
