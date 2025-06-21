
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { industries, technologies, solutions, variants } from '../data/fixtures';
import { useParameterStore } from '../store/useParameterStore';

interface HierarchySelectorProps {
  level: 1 | 2 | 3 | 4;
}

export const HierarchySelector: React.FC<HierarchySelectorProps> = ({ level }) => {
  const { hierarchy, setHierarchy } = useParameterStore();

  const getOptions = () => {
    switch (level) {
      case 1:
        return industries;
      case 2:
        return hierarchy.industryId ? technologies[hierarchy.industryId] || [] : [];
      case 3:
        return hierarchy.technologyId ? solutions[hierarchy.technologyId] || [] : [];
      case 4:
        return hierarchy.solutionId ? variants[hierarchy.solutionId] || [] : [];
      default:
        return [];
    }
  };

  const getCurrentValue = () => {
    switch (level) {
      case 1:
        return hierarchy.industryId;
      case 2:
        return hierarchy.technologyId;
      case 3:
        return hierarchy.solutionId;
      case 4:
        return hierarchy.variantId;
      default:
        return '';
    }
  };

  const getTitle = () => {
    switch (level) {
      case 1:
        return 'Select Industry';
      case 2:
        return 'Select Technology';
      case 3:
        return 'Select Solution';
      case 4:
        return 'Select Variant';
      default:
        return '';
    }
  };

  const options = getOptions();
  const currentValue = getCurrentValue();

  return (
    <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20">
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
        <CardDescription>
          Choose the most appropriate option for your configuration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          value={currentValue || ''}
          onValueChange={(value) => setHierarchy(level, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                <div>
                  <div className="font-medium">{option.name}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
