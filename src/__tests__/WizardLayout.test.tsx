import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { WizardLayout } from '../components/WizardLayout';

// Mock the store
jest.mock('../store/useParameterStore', () => ({
  useParameterStore: () => ({
    hierarchy: {},
    setCurrentStep: jest.fn(),
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('WizardLayout', () => {
  it('renders the wizard title', () => {
    renderWithRouter(<WizardLayout />);
    expect(screen.getByText('Industrial Configuration Wizard')).toBeInTheDocument();
  });

  it('renders all five wizard steps', () => {
    renderWithRouter(<WizardLayout />);
    expect(screen.getByText('Industry')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Solution')).toBeInTheDocument();
    expect(screen.getByText('Variant')).toBeInTheDocument();
    expect(screen.getByText('Product')).toBeInTheDocument();
  });

  it('shows progress indicator', () => {
    renderWithRouter(<WizardLayout />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });
}); 