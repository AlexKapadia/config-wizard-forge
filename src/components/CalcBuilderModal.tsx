
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useParameterStore } from '../store/useParameterStore';
import { Calculation } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { evaluate } from 'mathjs';
import { useToast } from '@/hooks/use-toast';

interface CalcBuilderModalProps {
  open: boolean;
  onClose: () => void;
  editCalc?: Calculation;
}

export const CalcBuilderModal: React.FC<CalcBuilderModalProps> = ({
  open,
  onClose,
  editCalc
}) => {
  const { addCalculation, updateCalculation, parameters } = useParameterStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = React.useState({
    name: '',
    formula: '',
    units: '',
    description: ''
  });

  React.useEffect(() => {
    if (editCalc) {
      setFormData({
        name: editCalc.name,
        formula: editCalc.formula,
        units: editCalc.units,
        description: editCalc.description
      });
    } else {
      setFormData({
        name: '',
        formula: '',
        units: '',
        description: ''
      });
    }
  }, [editCalc, open]);

  const validateFormula = (formula: string): boolean => {
    try {
      // Replace parameter IDs with dummy values for validation
      let testFormula = formula;
      parameters.forEach(param => {
        testFormula = testFormula.replace(new RegExp(param.id, 'g'), '1');
      });
      
      evaluate(testFormula);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.formula) {
      toast({
        title: "Validation Error",
        description: "Name and formula are required",
        variant: "destructive"
      });
      return;
    }

    if (!validateFormula(formData.formula)) {
      toast({
        title: "Invalid Formula",
        description: "Please check your formula syntax",
        variant: "destructive"
      });
      return;
    }

    const calculation: Calculation = {
      id: editCalc?.id || uuidv4(),
      name: formData.name,
      formula: formData.formula,
      units: formData.units,
      description: formData.description
    };

    if (editCalc) {
      updateCalculation(editCalc.id, 'name', formData.name);
      updateCalculation(editCalc.id, 'formula', formData.formula);
      updateCalculation(editCalc.id, 'units', formData.units);
      updateCalculation(editCalc.id, 'description', formData.description);
    } else {
      addCalculation(calculation);
    }

    toast({
      title: editCalc ? "Calculation Updated" : "Calculation Added",
      description: `${formData.name} has been ${editCalc ? 'updated' : 'created'} successfully`
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editCalc ? 'Edit Calculation' : 'New Calculation'}
          </DialogTitle>
          <DialogDescription>
            Create or modify calculation formulas. Use parameter IDs in your formulas.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="col-span-3"
              placeholder="e.g., Total Power Consumption"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="formula" className="text-right pt-2">
              Formula
            </Label>
            <div className="col-span-3">
              <Textarea
                id="formula"
                value={formData.formula}
                onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                placeholder="e.g., param1 * param2 + 100"
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Use parameter IDs and mathematical operators (+, -, *, /, ^, sqrt, etc.)
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="units" className="text-right">
              Units
            </Label>
            <Input
              id="units"
              value={formData.units}
              onChange={(e) => setFormData({ ...formData, units: e.target.value })}
              className="col-span-3"
              placeholder="e.g., kW, m³/min, °C"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="col-span-3"
              placeholder="Brief description of what this calculation represents"
            />
          </div>

          {/* Available Parameters Reference */}
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <h4 className="font-medium mb-2">Available Parameters:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {parameters.map(param => (
                <div key={param.id} className="flex justify-between">
                  <span>{param.name}:</span>
                  <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-xs">
                    {param.id.slice(0, 8)}...
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editCalc ? 'Update' : 'Create'} Calculation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
