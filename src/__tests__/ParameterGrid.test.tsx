
import { render, screen, fireEvent } from '@testing-library/react';
import { ParamGrid } from '../components/ParamGrid';
import { useParameterStore } from '../store/useParameterStore';

jest.mock('../store/useParameterStore');

describe('Parameter Grid', () => {
  const mockUpdateParameter = jest.fn();
  const mockResetParam = jest.fn();

  beforeEach(() => {
    (useParameterStore as jest.Mock).mockReturnValue({
      parameters: [
        {
          id: '1',
          name: 'Test Parameter',
          level: 1,
          units: 'kW',
          defaultValue: 100,
          value: null,
          description: 'Test description'
        }
      ],
      updateParameter: mockUpdateParameter,
      resetParam: mockResetParam
    });
  });

  test('renders parameter grid with data', () => {
    render(<ParamGrid />);
    
    expect(screen.getByText('Parameters Configuration')).toBeInTheDocument();
    expect(screen.getByText('Test Parameter')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('kW')).toBeInTheDocument();
  });

  test('handles parameter value override', () => {
    render(<ParamGrid />);
    
    const input = screen.getByPlaceholderText('100');
    fireEvent.change(input, { target: { value: '150' } });
    
    expect(mockUpdateParameter).toHaveBeenCalledWith('1', 'value', 150);
  });

  test('handles parameter reset', () => {
    (useParameterStore as jest.Mock).mockReturnValue({
      parameters: [
        {
          id: '1',
          name: 'Test Parameter',
          level: 1,
          units: 'kW',
          defaultValue: 100,
          value: 150, // Override value
          description: 'Test description'
        }
      ],
      updateParameter: mockUpdateParameter,
      resetParam: mockResetParam
    });

    render(<ParamGrid />);
    
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);
    
    expect(mockResetParam).toHaveBeenCalledWith('1');
  });
});
