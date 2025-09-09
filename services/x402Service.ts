import { createPaymentHeader, selectPaymentRequirements } from 'x402/client';
import type { PaymentRequirements } from 'x402/shared';

export class X402PaymentService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  /**
   * Make a paid request to the API with X402 payment handling
   */
  async makePaymentRequest(
    endpoint: string,
    requestData: any,
    headers: Record<string, string> = {},
    walletClient?: any
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      // Initial request - will return 402 Payment Required
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
            selectedRequirement
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