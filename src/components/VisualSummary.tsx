
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Parameter, Calculation } from '../types';

interface VisualSummaryProps {
  params: Parameter[];
  calcs: Calculation[];
}

export const VisualSummary: React.FC<VisualSummaryProps> = ({ params, calcs }) => {
  const overriddenParams = params.filter(p => p.value !== null && p.value !== p.defaultValue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Parameters Summary
            <Badge variant="secondary">{params.length} total</Badge>
          </CardTitle>
          <CardDescription>
            Configuration parameters across all levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2 text-sm">
              {[1, 2, 3, 4].map(level => {
                const levelParams = params.filter(p => p.level === level);
                return (
                  <div key={level} className="text-center">
                    <div className="font-semibold">Level {level}</div>
                    <div className="text-2xl font-bold text-primary">
                      {levelParams.length}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {overriddenParams.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Overridden Parameters:</h4>
                <div className="space-y-2">
                  {overriddenParams.slice(0, 5).map(param => (
                    <div key={param.id} className="flex justify-between text-sm">
                      <span>{param.name}</span>
                      <span className="font-mono">
                        {param.defaultValue} → {param.value} {param.units}
                      </span>
                    </div>
                  ))}
                  {overriddenParams.length > 5 && (
                    <div className="text-sm text-muted-foreground">
                      +{overriddenParams.length - 5} more...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Calculations Summary
            <Badge variant="secondary">{calcs.length} total</Badge>
          </CardTitle>
          <CardDescription>
            Custom calculations and formulas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {calcs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">📊</div>
              <p>No calculations defined</p>
            </div>
          ) : (
            <div className="space-y-3">
              {calcs.slice(0, 5).map(calc => (
                <div key={calc.id} className="border-l-2 border-primary pl-3">
                  <div className="font-medium text-sm">{calc.name}</div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {calc.formula}
                  </div>
                  {calc.value !== undefined && (
                    <div className="font-mono text-sm">
                      Result: {calc.value.toFixed(2)} {calc.units}
                    </div>
                  )}
                </div>
              ))}
              {calcs.length > 5 && (
                <div className="text-sm text-muted-foreground">
                  +{calcs.length - 5} more calculations...
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
