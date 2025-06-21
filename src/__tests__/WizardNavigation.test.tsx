
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WizardLayout } from '../components/WizardLayout';
import { useParameterStore } from '../store/useParameterStore';

// Mock the store
jest.mock('../store/useParameterStore');

const renderWithRouter = (component: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Wizard Navigation', () => {
  beforeEach(() => {
    (useParameterStore as jest.Mock).mockReturnValue({
      setCurrentStep: jest.fn(),
      hierarchy: {},
      parameters: [],
      calculations: []
    });
  });

  test('renders wizard layout with step indicators', () => {
    renderWithRouter(<WizardLayout />);
    
    expect(screen.getByText('Industrial Configuration Wizard')).toBeInTheDocument();
    expect(screen.getByText('Industry')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Solution')).toBeInTheDocument();
    expect(screen.getByText('Variant')).toBeInTheDocument();
    expect(screen.getByText('Product')).toBeInTheDocument();
  });

  test('shows progress bar progression', () => {
    renderWithRouter(<WizardLayout />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  test('enables step navigation for completed steps', async () => {
    (useParameterStore as jest.Mock).mockReturnValue({
      setCurrentStep: jest.fn(),
      hierarchy: { industryId: 'datacenter' },
      parameters: [],
      calculations: []
    });

    renderWithRouter(<WizardLayout />);
    
    const step1Button = screen.getByText('Industry').closest('button');
    expect(step1Button).not.toBeDisabled();
  });
});
