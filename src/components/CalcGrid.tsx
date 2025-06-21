
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription,CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useParameterStore } from '../store/useParameterStore';
import { CalcBuilderModal } from './CalcBuilderModal';
import { Calculation } from '../types';

export const CalcGrid: React.FC = () => {
  const { calculations, updateCalculation, removeCalculation } = useParameterStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCalc, setEditingCalc] = React.useState<Calculation | undefined>();

  const handleEdit = (calc: Calculation) => {
    setEditingCalc(calc);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCalc(undefined);
  };

  const handleDescriptionChange = (id: string, description: string) => {
    updateCalculation(id, 'description', description);
  };

  if (calculations.length === 0) {
    return (
      <>
        <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="text-6xl opacity-20">📊</div>
              <h3 className="text-lg font-medium">No Calculations Yet</h3>
              <p className="text-muted-foreground max-w-md">
                Start building your calculation models. Use the Copilot or create calculations manually.
              </p>
              <Button onClick={() => setIsModalOpen(true)} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                New Calculation
              </Button>
            </div>
          </CardContent>
        </Card>
        <CalcBuilderModal
          open={isModalOpen}
          onClose={handleModalClose}
          editCalc={editingCalc}
        />
      </>
    );
  }

  return (
    <>
      <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Calculations</CardTitle>
              <CardDescription>
                Manage your calculation formulas and view results
              </CardDescription>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Calculation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Formula</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculations.map((calc) => (
                  <TableRow key={calc.id}>
                    <TableCell className="font-medium">{calc.name}</TableCell>
                    <TableCell>
                      <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">
                        {calc.formula}
                      </code>
                    </TableCell>
                    <TableCell>
                      {calc.value !== undefined ? (
                        <span className="font-mono">{calc.value.toFixed(2)}</span>
                      ) : (
                        <span className="text-red-500 text-sm">Error</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{calc.units}</span>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={calc.description}
                        onChange={(e) => handleDescriptionChange(calc.id, e.target.value)}
                        className="min-w-[200px]"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(calc)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCalculation(calc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <CalcBuilderModal
        open={isModalOpen}
        onClose={handleModalClose}
        editCalc={editingCalc}
      />
    </>
  );
};
