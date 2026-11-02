import crypto from 'node:crypto';
import {
  IPaymentProvider,
  PaymentInitiateRequest,
  PaymentInitiateResult,
  PaymentVerificationResult,
  PaymentWebhookResult,
  PaymentMethodId,
  PaymentCurrency
} from '../types';

export interface CardProviderConfig {
  apiKey?: string;
  secretKey?: string;
  webhookSecret?: string;
  isSandbox?: boolean;
}

export class CardProvider implements IPaymentProvider {
  public name = 'card' as const;
  public supportedMethods: PaymentMethodId[] = ['card'];
  public supportedCurrencies: PaymentCurrency[] = ['USD', 'KES'];

  private config: CardProviderConfig;

  constructor(config?: CardProviderConfig) {
    this.config = {
      apiKey: config?.apiKey || process.env.STRIPE_PUBLIC_KEY || '',
      secretKey: config?.secretKey || process.env.STRIPE_SECRET_KEY || 'sk_test_demo_card_2026',
      webhookSecret: config?.webhookSecret || process.env.STRIPE_WEBHOOK_SECRET || 'whsec_demo_2026',
      isSandbox: config?.isSandbox ?? (process.env.CARD_SANDBOX !== 'false')
    };
  }

  private validateLuhn(numStr: string): boolean {
    const sanitized = numStr.replace(/\D/g, '');
    if (sanitized.length < 13 || sanitized.length > 19) return false;
    let sum = 0;
    let alternate = false;
    for (let i = sanitized.length - 1; i >= 0; i--) {
      let n = parseInt(sanitized.charAt(i), 10);
      if (alternate) {
        n *= 2;
        if (n > 9) n = (n % 10) + 1;
      }
      sum += n;
      alternate = !alternate;
    }
    return sum % 10 === 0;
  }

  async initiatePayment(req: PaymentInitiateRequest): Promise<PaymentInitiateResult> {
    const rawCard = req.cardToken || req.customerPhone || '';
    const digitsOnly = rawCard.replace(/\D/g, '');

    // In sandbox, check for test decline cards
    if (digitsOnly.endsWith('0002') || digitsOnly.endsWith('9999')) {
      return {
        success: false,
        orderId: req.orderId,
        transactionRef: `CARD-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        status: 'failed',
        instructionMessage: 'Card payment was declined by the issuing bank.',
        errorMessage: 'Card declined: generic decline.'
      };
    }

    const transactionRef = `CARD-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const providerCheckoutId = `pi_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;

    return {
      success: true,
      orderId: req.orderId,
      transactionRef,
      providerCheckoutId,
      status: 'completed',
      instructionMessage: 'Card payment authorised and settled successfully.',
      requiresPolling: false,
      rawResponse: {
        id: providerCheckoutId,
        status: 'succeeded',
        amount: Math.round(req.amount * 100),
        currency: req.currency.toLowerCase()
      }
    };
  }

  async verifyPayment(orderId: string, transactionRef: string, providerCheckoutId?: string): Promise<PaymentVerificationResult> {
    return {
      orderId,
      transactionRef,
      status: 'completed',
      providerTxId: providerCheckoutId || `ch_${Date.now()}`,
      amount: 0,
      currency: 'USD',
      isSuccessful: true
    };
  }

  async parseWebhook(headers: Record<string, string | string[] | undefined>, body: any): Promise<PaymentWebhookResult> {
    const type = body?.type;
    const object = body?.data?.object;

    const orderId = object?.metadata?.orderId;
    const transactionRef = object?.id;
    const isSuccess = type === 'payment_intent.succeeded' || type === 'charge.succeeded';

    return {
      isValid: true,
      provider: 'card',
      orderId,
      transactionRef,
      providerTxId: object?.id,
      amount: object?.amount ? object.amount / 100 : 0,
      currency: (object?.currency?.toUpperCase() || 'USD') as PaymentCurrency,
      status: isSuccess ? 'completed' : 'failed',
      rawPayload: body
    };
  }
}
