import { createPaymentHeader, selectPaymentRequirements } from 'x402/client';
import type { PaymentRequirements } from 'x402/shared';
import { STELLAR_CONFIG, getStellarToken } from '../config/stellar';

export class X402PaymentService {

  constructor() {
  }

  /**
   * Make a paid request to the API with X402 payment handling or Stellar token
   */
  async makePaymentRequest(
    endpoint: string,
    requestData: any,
    headers: Record<string, string> = {},
    walletClient?: any
  ): Promise<any> {
    const url = `${endpoint}`;

    // Check for stellar token
    const stellarToken = getStellarToken();

    try {
      // If stellar token exists, use it instead of x402
      if (stellarToken) {
        console.log('Using Stellar API with token:', stellarToken.substring(0, 6) + '...');

        // Use the same endpoint but with stellar token header
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-token': stellarToken,
            ...headers
          },
          body: JSON.stringify(requestData)
        });

        if (!response.ok) {
          throw new Error(`Stellar API request failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      }

      // Original x402 flow
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(requestData)
      });

      // If payment is required
      if (response.status === 402) {
        const paymentInfo = await response.json();
        console.log('Payment required:', paymentInfo);
        
        if (!walletClient) {
          const networkName = paymentInfo.accepts?.[0]?.network || 'base';
          const amount = paymentInfo.accepts?.[0]?.maxAmountRequired ? (parseFloat(paymentInfo.accepts[0].maxAmountRequired) / 1000000).toFixed(2) : '0.50';
          throw new Error(
            `Payment required: USDC ${amount} on ${networkName}. Please connect a Web3 wallet to pay.`
          );
        }

        // Create payment header using X402 client
        try {
          const selectedRequirement = selectPaymentRequirements(paymentInfo.accepts);
          const paymentHeader = await createPaymentHeader(
            walletClient,
            paymentInfo.x402Version || 1,
            selectedRequirement,
            {
              // Enable fast confirmation mode
              fastConfirmation: true,
              skipTxWait: true
            }
          );

          // Retry request with payment header
          const paidResponse = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Payment': paymentHeader,
              ...headers
            },
            body: JSON.stringify(requestData)
          });

          if (!paidResponse.ok) {
            throw new Error(`Payment request failed: ${paidResponse.status} ${paidResponse.statusText}`);
          }

          return await paidResponse.json();
        } catch (paymentError) {
          console.error('Payment processing error:', paymentError);
          throw new Error(`Payment failed: ${paymentError instanceof Error ? paymentError.message : 'Unknown error'}`);
        }
      }

      // If no payment required
      if (response.ok) {
        return await response.json();
      }

      throw new Error(`Request failed: ${response.status} ${response.statusText}`);

    } catch (error) {
      console.error('X402 payment request error:', error);

      // Provide better error messages for common issues
      if (error instanceof Error && stellarToken) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Unable to reach the API server. Please check your internet connection.');
        }
        if (error.message.includes('401') || error.message.includes('403')) {
          throw new Error(`Invalid Stellar token. Please check your access token.`);
        }
        if (error.message.includes('Stellar API request failed')) {
          throw new Error(`Stellar API error: ${error.message}`);
        }
      }

      throw error;
    }
  }

  /**
   * Check if payment is required for an endpoint
   */
  async checkPaymentRequired(endpoint: string): Promise<{
    required: boolean;
    price?: string;
    network?: string;
    description?: string;
  }> {
    // If using stellar token, payment is not required
    const stellarToken = getStellarToken();
    if (stellarToken) {
      return { required: false };
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test: true })
      });

      if (response.status === 402) {
        const paymentInfo = await response.json();
        return {
          required: true,
          price: paymentInfo.price,
          network: paymentInfo.network,
          description: paymentInfo.description
        };
      }

      return { required: false };
    } catch (error) {
      console.error('Error checking payment requirement:', error);
      return { required: false };
    }
  }
}

// Export singleton instance
export const x402Service = new X402PaymentService();