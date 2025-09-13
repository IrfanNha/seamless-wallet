'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { mempoolService } from '@/services/mempoolService';

const createWalletSchema = z.object({
  name: z.string().min(1, 'Wallet name is required').max(50, 'Name must be less than 50 characters'),
  address: z.string().min(26, 'Invalid Bitcoin address').max(62, 'Invalid Bitcoin address'),
});

const updateWalletSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Wallet name is required').max(50, 'Name must be less than 50 characters').optional(),
  isActive: z.boolean().optional(),
});

export async function createWallet(formData: FormData) {
  try {
    const rawFormData = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
    };

    const validatedFields = createWalletSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
      return {
        success: false,
        error: 'Invalid form data',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, address } = validatedFields.data;

    // Validate Bitcoin address format
    if (!validateBitcoinAddress(address)) {
      return {
        success: false,
        error: 'Invalid Bitcoin address format',
      };
    }

    // Verify address exists on the blockchain
    try {
      await mempoolService.getAddressInfo(address);
    } catch (error) {
      return {
        success: false,
        error: 'Address not found on the blockchain or invalid',
      };
    }

    // In a real application, you would save this to a database
    // For now, we'll just return success
    const newWallet = {
      id: crypto.randomUUID(),
      name,
      address,
      balance: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    revalidatePath('/');
    
    return {
      success: true,
      data: newWallet,
    };
  } catch (error) {
    console.error('Error creating wallet:', error);
    return {
      success: false,
      error: 'Failed to create wallet',
    };
  }
}

export async function updateWallet(formData: FormData) {
  try {
    const rawFormData = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      isActive: formData.get('isActive') === 'true',
    };

    const validatedFields = updateWalletSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
      return {
        success: false,
        error: 'Invalid form data',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { id, name, isActive } = validatedFields.data;

    // In a real application, you would update this in the database
    // For now, we'll just return success
    const updatedWallet = {
      id,
      name,
      isActive,
      updatedAt: new Date(),
    };

    revalidatePath('/');
    
    return {
      success: true,
      data: updatedWallet,
    };
  } catch (error) {
    console.error('Error updating wallet:', error);
    return {
      success: false,
      error: 'Failed to update wallet',
    };
  }
}

export async function deleteWallet(walletId: string) {
  try {
    if (!walletId || typeof walletId !== 'string') {
      return {
        success: false,
        error: 'Invalid wallet ID',
      };
    }

    // In a real application, you would delete this from the database
    // For now, we'll just return success
    revalidatePath('/');
    
    return {
      success: true,
      message: 'Wallet deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting wallet:', error);
    return {
      success: false,
      error: 'Failed to delete wallet',
    };
  }
}

export async function refreshWalletData(walletId: string) {
  try {
    if (!walletId || typeof walletId !== 'string') {
      return {
        success: false,
        error: 'Invalid wallet ID',
      };
    }

    // In a real application, you would fetch fresh data from the blockchain
    // and update the database
    revalidatePath('/');
    
    return {
      success: true,
      message: 'Wallet data refreshed successfully',
    };
  } catch (error) {
    console.error('Error refreshing wallet data:', error);
    return {
      success: false,
      error: 'Failed to refresh wallet data',
    };
  }
}

export async function getRecommendedFees() {
  try {
    const fees = await mempoolService.getRecommendedFees();
    
    return {
      success: true,
      data: fees,
    };
  } catch (error) {
    console.error('Error fetching recommended fees:', error);
    return {
      success: false,
      error: 'Failed to fetch recommended fees',
    };
  }
}

export async function getMempoolStats() {
  try {
    const mempoolTxs = await mempoolService.getMempoolTransactions();
    const currentHeight = await mempoolService.getCurrentBlockHeight();
    
    return {
      success: true,
      data: {
        mempoolSize: mempoolTxs.length,
        currentBlockHeight: currentHeight,
        averageFee: mempoolTxs.reduce((sum, tx) => sum + tx.fee, 0) / mempoolTxs.length,
      },
    };
  } catch (error) {
    console.error('Error fetching mempool stats:', error);
    return {
      success: false,
      error: 'Failed to fetch mempool statistics',
    };
  }
}

// Helper function to validate Bitcoin addresses
function validateBitcoinAddress(address: string): boolean {
  // Basic Bitcoin address validation (Legacy, SegWit, Bech32)
  const legacyRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const segwitRegex = /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const bech32Regex = /^bc1[a-z0-9]{39,59}$/;
  
  return legacyRegex.test(address) || segwitRegex.test(address) || bech32Regex.test(address);
}
