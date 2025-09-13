'use client';

import { useState } from 'react';
import { WalletCard } from './WalletCard';
import { DeleteWalletDialog } from './DeleteWalletDialog';
import { useWallet } from '@/hooks/useWallet';
import { toast } from 'sonner'; // Atau notification library lain yang Anda gunakan

interface Wallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  isActive: boolean;
  updatedAt: string | Date;
  createdAt?: string | Date;
}

interface WalletCardWithActionsProps {
  wallet: Wallet;
  isActive?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onCheckMempool?: (address: string) => void;
}

export const WalletCardWithActions: React.FC<WalletCardWithActionsProps> = ({
  wallet,
  isActive = false,
  onSelect,
  onEdit,
  onCheckMempool,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteWallet } = useWallet();

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async (walletId: string) => {
    try {
      setIsDeleting(true);
      
      const result = await deleteWallet(walletId);
      
      if (result.success) {
        // Show success notification
        toast.success('Wallet Deleted', {
          description: result.message,
          duration: 4000,
        });
        
        setShowDeleteDialog(false);
      } else {
        // Show error notification
        toast.error('Delete Failed', {
          description: result.message,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error deleting wallet:', error);
      toast.error('Delete Failed', {
        description: 'An unexpected error occurred while deleting the wallet.',
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setIsDeleting(false);
  };

  return (
    <>
      <WalletCard
        wallet={wallet}
        isActive={isActive}
        onSelect={onSelect}
        onEdit={onEdit}
        onDelete={handleDelete}
        onCheckMempool={onCheckMempool}
      />

      <DeleteWalletDialog
        wallet={wallet}
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </>
  );
};