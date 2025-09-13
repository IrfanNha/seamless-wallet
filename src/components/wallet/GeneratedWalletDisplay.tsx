'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { GeneratedWallet } from '@/utils/bitcoinUtils';
import { 
  Copy, 
  Eye, 
  EyeOff, 
  Download, 
  AlertTriangle, 
  Shield, 
  Key,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface GeneratedWalletDisplayProps {
  wallet: GeneratedWallet;
  onClose: () => void;
  onSave: () => void;
}

export const GeneratedWalletDisplay: React.FC<GeneratedWalletDisplayProps> = ({
  wallet,
  onClose,
  onSave,
}) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showWIF, setShowWIF] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadWalletInfo = () => {
    const walletInfo = `
Bitcoin Wallet Information
========================

Address: ${wallet.address}
Private Key: ${wallet.privateKey}
WIF: ${wallet.wif}
Public Key: ${wallet.publicKey}

Generated: ${new Date().toISOString()}

⚠️  SECURITY WARNING ⚠️
- Keep your private key and WIF secure
- Never share them with anyone
- Store them in a safe place offline
- This information cannot be recovered if lost
`;

    const blob = new Blob([walletInfo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bitcoin-wallet-${wallet.address.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ScrollReveal direction="up" delay={100}>
      <div className="space-y-6 pb-16 md:pb-14 max-h-[80vh] overflow-y-auto custom-scrollbar">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              Wallet Generated Successfully!
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Your new Bitcoin wallet is ready. Please save your private key securely.
            </p>
          </div>
        </motion.div>

        {/* Critical Security Warning */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800"
        >
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-red-800 dark:text-red-200">
                ⚠️ CRITICAL SECURITY WARNING ⚠️
              </h3>
              <div className="space-y-2 text-sm text-red-700 dark:text-red-300">
                <p>• <strong>Save your private key immediately</strong> - it cannot be recovered if lost</p>
                <p>• <strong>Never share your private key</strong> with anyone or any website</p>
                <p>• <strong>Store it offline</strong> in a secure location (hardware wallet, paper wallet)</p>
                <p>• <strong>This is a demo wallet</strong> - do not use for real funds without proper security</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Wallet Information Cards */}
        <div className="grid grid-cols-1 gap-4">
          {/* Bitcoin Address */}
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                <ExternalLink className="w-5 h-5" />
                <span>Bitcoin Address</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Public
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <code className="flex-1 text-sm font-mono text-slate-700 dark:text-slate-300 break-all">
                  {wallet.address}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(wallet.address, 'address')}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {copiedField === 'address' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Private Key */}
          <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-red-800 dark:text-red-200">
                <Key className="w-5 h-5" />
                <span>Private Key</span>
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  SECRET
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800">
                  <code className="flex-1 text-sm font-mono text-slate-700 dark:text-slate-300 break-all">
                    {showPrivateKey ? wallet.privateKey : `${wallet.privateKey.slice(0, 8)}...${wallet.privateKey.slice(-8)}`}
                  </code>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(wallet.privateKey, 'privateKey')}
                      className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      {copiedField === 'privateKey' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-red-600 dark:text-red-400">
                  ⚠️ Keep this private key secure and never share it!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* WIF */}
          <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
                <Shield className="w-5 h-5" />
                <span>WIF (Wallet Import Format)</span>
                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  SECRET
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-800">
                  <code className="flex-1 text-sm font-mono text-slate-700 dark:text-slate-300 break-all">
                    {showWIF ? wallet.wif : `${wallet.wif.slice(0, 8)}...${wallet.wif.slice(-8)}`}
                  </code>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowWIF(!showWIF)}
                      className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      {showWIF ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(wallet.wif, 'wif')}
                      className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      {copiedField === 'wif' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  Alternative format for importing into other wallets
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button
            onClick={downloadWalletInfo}
            className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Wallet Info
          </Button>
          
          <Button
            onClick={onSave}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Save to Wallet List
          </Button>
          
          <Button
            onClick={onClose}
            variant="outline"
            className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Close
          </Button>
        </motion.div>
      </div>
    </ScrollReveal>
  );
};
