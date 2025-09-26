import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

interface PaymentErrorMessageProps {
  message: string;
  onRetry?: () => void;
  isUsingStellar?: boolean;
}

const PaymentErrorMessage: React.FC<PaymentErrorMessageProps> = ({ message, onRetry, isUsingStellar = false }) => {
  const { isConnected } = useAccount();

  const isPaymentError = message.includes('Payment required');
  
  return (
    <div className="p-6 bg-red-900/30 border border-red-500/30 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <h3 className="text-lg font-semibold text-red-300">
          {isPaymentError ? 'Payment Required' : 'An Error Occurred'}
        </h3>
      </div>
      
      <p className="text-red-200 mb-4">{message}</p>
      
      {isPaymentError && !isUsingStellar && (
        <div className="space-y-3">
          {!isConnected ? (
            <div className="p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-md">
              <p className="text-yellow-200 text-sm mb-3">
                Connect your wallet to pay with USDC and generate images:
              </p>
              <ConnectButton />
            </div>
          ) : (
            <div className="p-3 bg-green-900/30 border border-green-500/30 rounded-md">
              <p className="text-green-200 text-sm mb-3">
                ✅ Wallet connected! Click "Generate" again to proceed with payment.
              </p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold rounded-md hover:from-orange-600 hover:to-yellow-500 transition-colors duration-200"
                >
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentErrorMessage;