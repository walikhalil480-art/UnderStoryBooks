export type PaymentCurrency = 'USD' | 'KES' | 'SOS';

export type PaymentProviderName = 'mpesa' | 'sifalo' | 'card';

export type PaymentMethodId = 'mpesa_stk' | 'evc_plus' | 'zaad' | 'sahal' | 'card';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

export interface PaymentInitiateRequest {
  orderId: string;
  bookId: string;
  bookTitle: string;
  amount: number;
  currency: PaymentCurrency;
  method: PaymentMethodId;
  customerPhone?: string;
  customerEmail: string;
  customerName: string;
  cardToken?: string;
  callbackUrl?: string;
}

export interface PaymentInitiateResult {
  success: boolean;
  orderId: string;
  transactionRef: string;
  providerCheckoutId?: string;
  status: OrderStatus;
  instructionMessage: string;
  requiresPolling?: boolean;
  pollIntervalMs?: number;
  errorMessage?: string;
  rawResponse?: Record<string, any>;
}

export interface PaymentVerificationResult {
  orderId: string;
  transactionRef: string;
  status: OrderStatus;
  providerTxId?: string;
  amount: number;
  currency: PaymentCurrency;
  isSuccessful: boolean;
  errorMessage?: string;
  rawResponse?: Record<string, any>;
}

export interface PaymentWebhookResult {
  isValid: boolean;
  provider: PaymentProviderName;
  orderId?: string;
  transactionRef?: string;
  providerTxId?: string;
  amount?: number;
  currency?: PaymentCurrency;
  status: OrderStatus;
  errorMessage?: string;
  rawPayload: Record<string, any>;
}

export interface IPaymentProvider {
  name: PaymentProviderName;
  supportedMethods: PaymentMethodId[];
  supportedCurrencies: PaymentCurrency[];
  initiatePayment(req: PaymentInitiateRequest): Promise<PaymentInitiateResult>;
  verifyPayment(orderId: string, transactionRef: string, providerCheckoutId?: string): Promise<PaymentVerificationResult>;
  parseWebhook(headers: Record<string, string | string[] | undefined>, body: any): Promise<PaymentWebhookResult>;
}
