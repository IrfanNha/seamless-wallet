'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { AddressGenerationProgress } from './AddressGenerationProgress';
import { GeneratedWalletDisplay } from './GeneratedWalletDisplay';
import { Wallet, Loader2, Sparkles } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { generateBitcoinAddress, AddressGenerationProgress as ProgressType, GeneratedWallet } from '@/utils/bitcoinUtils';

const createWalletSchema = z.object({
  name: z.string().min(1, 'Wallet name is required').max(50, 'Name must be less than 50 characters'),
});

type CreateWalletForm = z.infer<typeof createWalletSchema>;

interface CreateWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DialogState = 'form' | 'generating' | 'generated';

export const CreateWalletDialog: React.FC<CreateWalletDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>('form');
  const [generationProgress, setGenerationProgress] = useState<ProgressType | null>(null);
  const [generatedWallet, setGeneratedWallet] = useState<GeneratedWallet | null>(null);
  const { createWallet } = useWallet();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateWalletForm>({
    resolver: zodResolver(createWalletSchema),
  });

  const walletName = watch('name');

  const onSubmit = async (_data: CreateWalletForm) => {
    setIsCreating(true);
    setDialogState('generating');
    
    try {
      const wallet = await generateBitcoinAddress((progress) => {
        setGenerationProgress(progress);
      });
      
      setGeneratedWallet(wallet);
      setDialogState('generated');
    } catch (error) {
      console.error('Error generating wallet:', error);
      setDialogState('form');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveWallet = async () => {
    if (!generatedWallet) return;
    
    try {
      await createWallet(walletName || 'Generated Wallet', generatedWallet.address);
      handleClose();
    } catch (error) {
      console.error('Error saving wallet:', error);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      reset();
      setDialogState('form');
      setGenerationProgress(null);
      setGeneratedWallet(null);
      onOpenChange(false);
    }
  };

  const getDialogContent = () => {
    switch (dialogState) {
      case 'generating':
        return (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                <Sparkles className="w-5 h-5" />
                <span>Generating Bitcoin Address</span>
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Creating a new Bitcoin wallet with cryptographically secure keys...
              </DialogDescription>
            </DialogHeader>
            
            {generationProgress && (
              <AddressGenerationProgress 
                progress={generationProgress} 
                isVisible={true} 
              />
            )}
          </div>
        );

      case 'generated':
        return (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                <Wallet className="w-5 h-5" />
                <span>Wallet Generated</span>
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Your new Bitcoin wallet has been created successfully.
              </DialogDescription>
            </DialogHeader>
            
            {generatedWallet && (
              <GeneratedWalletDisplay
                wallet={generatedWallet}
                onClose={handleClose}
                onSave={handleSaveWallet}
              />
            )}
          </div>
        );

      default:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                <Wallet className="w-5 h-5" />
                <span>Create New Wallet</span>
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Generate a new Bitcoin wallet with a unique address and private key.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <ScrollReveal direction="up" delay={100}>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">
                      Wallet Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="My Bitcoin Wallet"
                      className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      {...register('name')}
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600 dark:text-red-400"
                      >
                        {errors.name.message}
                      </motion.p>
                    )}
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={200}>
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start space-x-3">
                      <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                          Generate New Address
                        </h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          A new Bitcoin address and private key will be generated for you. Make sure to save your private key securely!
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isCreating}
                  className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Wallet
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 ${
        dialogState === 'generated' ? 'sm:max-w-6xl max-h-[90vh] overflow-hidden' : 'sm:max-w-md'
      }`}>
        {getDialogContent()}
      </DialogContent>
    </Dialog>
  );
};
