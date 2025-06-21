
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RotateCcw } from 'lucide-react';
import { useParameterStore } from '../store/useParameterStore';
import { motion } from 'framer-motion';

export const ParamGrid: React.FC = () => {
  const { parameters, updateParameter, resetParam } = useParameterStore();

  const handleValueChange = (id: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    updateParameter(id, 'value', numValue);
  };

  const handleDescriptionChange = (id: string, description: string) => {
    updateParameter(id, 'description', description);
  };

  const isOverridden = (param: any) => param.value !== null && param.value !== param.defaultValue;

  return (
    <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20">
      <CardHeader>
        <CardTitle>Parameters Configuration</CardTitle>
        <CardDescription>
          Configure system parameters. Override default values as needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Level</TableHead>
                <TableHead>Parameter</TableHead>
                <TableHead>Default Value</TableHead>
                <TableHead>Override Value</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parameters.map((param) => (
                <motion.tr
                  key={param.id}
                  className={`${
                    isOverridden(param)
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 animate-flash-lime'
                      : ''
                  }`}
                  layout
                >
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                      L{param.level}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{param.name}</TableCell>
                  <TableCell>{param.defaultValue ?? 'N/A'}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={param.value?.toString() || ''}
                      onChange={(e) => handleValueChange(param.id, e.target.value)}
                      placeholder={param.defaultValue?.toString() || ''}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{param.units}</span>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={param.description}
                      onChange={(e) => handleDescriptionChange(param.id, e.target.value)}
                      className="min-w-[200px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => resetParam(param.id)}
                      disabled={!isOverridden(param)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
