'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AddressGenerationProgress as ProgressType } from '@/utils/bitcoinUtils';
import { 
  CheckCircle, 
  Loader2, 
  Shield, 
  Key, 
  Hash, 
  Code,
  Sparkles
} from 'lucide-react';

interface AddressGenerationProgressProps {
  progress: ProgressType;
  isVisible: boolean;
}

const stageIcons = {
  validating: Shield,
  generating: Loader2,
  deriving: Key,
  encoding: Hash,
  complete: CheckCircle,
};

const stageColors = {
  validating: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  generating: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  deriving: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  encoding: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  complete: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export const AddressGenerationProgress: React.FC<AddressGenerationProgressProps> = ({
  progress,
  isVisible,
}) => {
  const Icon = stageIcons[progress.stage];
  const isComplete = progress.stage === 'complete';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full"
        >
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-slate-600/5 to-slate-500/5 dark:from-slate-400/5 dark:via-slate-500/5 dark:to-slate-400/5" />
            
            <CardContent className="p-6 relative">
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-3">
                  <motion.div
                    animate={{ 
                      rotate: isComplete ? 0 : 360,
                      scale: isComplete ? 1.1 : 1 
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: isComplete ? 0 : Infinity, ease: 'linear' },
                      scale: { duration: 0.3 }
                    }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 text-white mx-auto"
                  >
                    <Icon className={`w-8 h-8 ${progress.stage === 'generating' ? 'animate-spin' : ''}`} />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      {isComplete ? 'Address Generated!' : 'Generating Bitcoin Address'}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {progress.message}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Progress
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {progress.progress}%
                    </span>
                  </div>
                  
                  <div className="relative">
                    <Progress 
                      value={progress.progress} 
                      className="h-3 bg-slate-200 dark:bg-slate-700"
                    />
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-slate-500 to-slate-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.progress}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Stage Indicator */}
                <div className="flex items-center justify-center space-x-2">
                  <Badge className={stageColors[progress.stage]}>
                    {progress.stage.charAt(0).toUpperCase() + progress.stage.slice(1)}
                  </Badge>
                  
                  {isComplete && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    >
                      <Sparkles className="w-4 h-4 text-green-500" />
                    </motion.div>
                  )}
                </div>

                {/* Security Notice */}
                {isComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                  >
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                          Security Notice
                        </h4>
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                          Your private key will be displayed next. Please save it securely - it cannot be recovered if lost!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
