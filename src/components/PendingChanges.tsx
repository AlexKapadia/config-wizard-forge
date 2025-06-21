
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Undo, AlertCircle } from 'lucide-react';
import { useParameterStore } from '../store/useParameterStore';
import { Patch } from '../types';

interface PendingChangesProps {
  patches: Patch[];
}

export const PendingChanges: React.FC<PendingChangesProps> = ({ patches }) => {
  const { rollback, commitPatches, parameters, calculations } = useParameterStore();

  if (patches.length === 0) {
    return (
      <Card className="m-4">
        <CardContent className="p-4 text-center">
          <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
          <p className="text-sm text-muted-foreground">
            No pending changes
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderPatch = (patch: Patch, index: number) => {
    if (patch.action === 'update') {
      const param = parameters.find(p => p.id === patch.id);
      const calc = calculations.find(c => c.id === patch.id);
      const entity = param || calc;
      
      return (
        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">Update</Badge>
              <span className="text-sm font-medium">
                {entity?.name || 'Unknown'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {patch.field}: {String(patch.newValue)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => rollback(index)}
          >
            <Undo className="h-3 w-3" />
          </Button>
        </div>
      );
    } else if (patch.action === 'create' && patch.entity === 'calculation') {
      return (
        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="text-xs">Create</Badge>
              <span className="text-sm font-medium">
                {patch.payload.name}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              New calculation: {patch.payload.formula}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => rollback(index)}
          >
            <Undo className="h-3 w-3" />
          </Button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm">Pending Changes</CardTitle>
            <CardDescription className="text-xs">
              {patches.length} change(s) ready to commit
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => rollback(0)}
              className="text-xs"
            >
              Clear All
            </Button>
            <Button
              size="sm"
              onClick={commitPatches}
              className="text-xs"
            >
              Commit
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {patches.map((patch, index) => renderPatch(patch, index))}
        </div>
      </CardContent>
    </Card>
  );
};
