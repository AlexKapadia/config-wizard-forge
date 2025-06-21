
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Save, ArrowLeft } from 'lucide-react';
import { useParameterStore } from '../store/useParameterStore';
import { VisualSummary } from '../components/VisualSummary';
import { industries, technologies, solutions, variants } from '../data/fixtures';
import { useToast } from '@/hooks/use-toast';

export const ReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hierarchy, parameters, calculations, patches, commitPatches } = useParameterStore();

  const getHierarchyName = (level: keyof typeof hierarchy, data: any[]) => {
    const id = hierarchy[level];
    return data.find(item => item.id === id)?.name || 'Not selected';
  };

  const handleSave = () => {
    commitPatches();
    toast({
      title: "Configuration Saved",
      description: "Your industrial system configuration has been saved successfully",
    });
    
    // In a real app, this would save to backend
    console.log('Saving configuration:', {
      hierarchy,
      parameters,
      calculations
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Configuration Review
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Review your configuration before saving
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => navigate('/wizard/step/5')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Builder
              </Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>
            </div>
          </div>

          {/* Hierarchy Summary */}
          <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20">
            <CardHeader>
              <CardTitle>Configuration Hierarchy</CardTitle>
              <CardDescription>
                Your selected configuration path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">Industry</Badge>
                  <p className="font-semibold">
                    {getHierarchyName('industryId', industries)}
                  </p>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">Technology</Badge>
                  <p className="font-semibold">
                    {getHierarchyName('technologyId', technologies[hierarchy.industryId || ''] || [])}
                  </p>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">Solution</Badge>
                  <p className="font-semibold">
                    {getHierarchyName('solutionId', solutions[hierarchy.technologyId || ''] || [])}
                  </p>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">Variant</Badge>
                  <p className="font-semibold">
                    {getHierarchyName('variantId', variants[hierarchy.solutionId || ''] || [])}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Summary */}
          <VisualSummary params={parameters} calcs={calculations} />

          {/* Pending Changes */}
          {patches.length > 0 && (
            <Card className="backdrop-blur-sm bg-yellow-50/50 dark:bg-yellow-900/20 border-yellow-200/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-yellow-600" />
                  <span>Pending Changes</span>
                  <Badge variant="secondary">{patches.length}</Badge>
                </CardTitle>
                <CardDescription>
                  These changes will be applied when you save
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {patches.slice(0, 10).map((patch, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Badge variant="outline" className="text-xs">
                        {patch.action}
                      </Badge>
                      <span>
                        {patch.action === 'update' 
                          ? `Update ${patch.field} to ${patch.newValue}`
                          : patch.action === 'create' && patch.entity === 'calculation'
                          ? `Create calculation: ${patch.payload.name}`
                          : 'Unknown change'
                        }
                      </span>
                    </div>
                  ))}
                  {patches.length > 10 && (
                    <p className="text-sm text-muted-foreground">
                      +{patches.length - 10} more changes...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Card className="backdrop-blur-sm bg-green-50/50 dark:bg-green-900/20 border-green-200/50 inline-block">
              <CardContent className="p-6">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to Save</h3>
                <p className="text-muted-foreground mb-4">
                  Your configuration is complete and ready to be saved
                </p>
                <Button onClick={handleSave} size="lg" className="bg-green-600 hover:bg-green-700">
                  <Save className="h-5 w-5 mr-2" />
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
