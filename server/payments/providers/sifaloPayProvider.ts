import crypto from 'node:crypto';
import {
  IPaymentProvider,
  PaymentInitiateRequest,
  PaymentInitiateResult,
  PaymentVerificationResult,
  PaymentWebhookResult,
  PaymentMethodId,
  PaymentCurrency,
  OrderStatus
} from '../types';

export interface SifaloPayConfig {
  apiKey?: string;
  secretKey?: string;
  merchantId?: string;
  webhookSecret?: string;
  isSandbox?: boolean;
}

export class SifaloPayProvider implements IPaymentProvider {
  public name = 'sifalo' as const;
  public supportedMethods: PaymentMethodId[] = ['evc_plus', 'zaad', 'sahal'];
  public supportedCurrencies: PaymentCurrency[] = ['USD', 'SOS'];

  private config: SifaloPayConfig;
  private pendingSimulatedOrders = new Map<string, { status: OrderStatus; receipt: string }>();

  constructor(config?: SifaloPayConfig) {
    this.config = {
      apiKey: config?.apiKey || process.env.SIFALO_API_KEY || '',
      secretKey: config?.secretKey || process.env.SIFALO_SECRET_KEY || 'sifalo_sec_test_demo_2026',
      merchantId: config?.merchantId || process.env.SIFALO_MERCHANT_ID || 'mer_ebaro_somalia',
      webhookSecret: config?.webhookSecret || process.env.SIFALO_WEBHOOK_SECRET || 'sifalo_webhook_secret_2026',
      isSandbox: config?.isSandbox ?? (process.env.SIFALO_SANDBOX !== 'false')
    };
  }

  /**
   * Normalizes Somali phone numbers to standard 252XXXXXXXXX format
   */
  public normalizeSomaliPhone(phone: string): string {
    let digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0')) {
      digits = '252' + digits.substring(1);
    } else if (digits.startsWith('61') || digits.startsWith('63') || digits.startsWith('90')) {
      digits = '252' + digits;
    }
    return digits;
  }

  /**
   * Validates if phone matches the chosen mobile wallet network
   */
  public validatePhoneForMethod(phone: string, method: PaymentMethodId): { valid: boolean; message?: string } {
    const normalized = this.normalizeSomaliPhone(phone);
    if (normalized.length < 9) {
      return { valid: false, message: 'Phone number is too short.' };
    }

    if (method === 'evc_plus' && !normalized.startsWith('25261') && !normalized.startsWith('25268')) {
      return { valid: false, message: 'EVC Plus requires a Hormuud number (starts with 061).' };
    }
    if (method === 'zaad' && !normalized.startsWith('25263')) {
      return { valid: false, message: 'ZAAD requires a Telesom number (starts with 063).' };
    }
    if (method === 'sahal' && !normalized.startsWith('25290')) {
      return { valid: false, message: 'Sahal requires a Golis number (starts with 090).' };
    }
    return { valid: true };
  }

  /**
   * Generates HMAC-SHA256 signature for payload verification
   */
  public generateHmacSignature(payload: string): string {
    return crypto
      .createHmac('sha256', this.config.webhookSecret || this.config.secretKey || '')
      .update(payload)
      .digest('hex');
  }

  async initiatePayment(req: PaymentInitiateRequest): Promise<PaymentInitiateResult> {
    const rawPhone = req.customerPhone || '';
    const phone = this.normalizeSomaliPhone(rawPhone);

    const validation = this.validatePhoneForMethod(phone, req.method);
    if (!validation.valid) {
      return {
        success: false,
        orderId: req.orderId,
        transactionRef: `SIF-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        status: 'failed',
        instructionMessage: validation.message || 'Invalid Somali phone number for selected provider.',
        errorMessage: validation.message
      };
    }

    const transactionRef = `SIF-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const providerCheckoutId = `sif_ch_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    // Test failure scenario
    if (phone.endsWith('000000') || phone.endsWith('999999')) {
      return {
        success: false,
        orderId: req.orderId,
        transactionRef,
        providerCheckoutId,
        status: 'failed',
        instructionMessage: 'Mobile money payment failed or was rejected by user.',
        errorMessage: 'User cancelled transaction or insufficient wallet balance.'
      };
    }

    // In sandbox / development mode
    if (this.config.isSandbox || !this.config.apiKey) {
      const receipt = `SIF-REC-${Date.now().toString().slice(-6)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
      this.pendingSimulatedOrders.set(req.orderId, {
        status: 'completed',
        receipt
      });

      const providerLabel = req.method === 'evc_plus' ? 'EVC Plus' : req.method === 'zaad' ? 'ZAAD' : 'Sahal';
      return {
        success: true,
        orderId: req.orderId,
        transactionRef,
        providerCheckoutId,
        status: 'completed',
        instructionMessage: `Prompt sent to ${providerLabel} (${phone}). Payment successfully verified in Sandbox mode.`,
        requiresPolling: false,
        rawResponse: {
          reference: transactionRef,
          providerRef: receipt,
          status: 'PAID',
          channel: req.method
        }
      };
    }

    // Live Sifalo Pay API Call
    try {
      const payload = {
        merchantId: this.config.merchantId,
        orderId: req.orderId,
        amount: req.amount,
        currency: req.currency,
        payerPhone: phone,
        channel: req.method,
        description: `Ebook Purchase: ${req.bookTitle.slice(0, 50)}`,
        callbackUrl: req.callbackUrl
      };

      const res = await fetch('https://api.sifalopay.com/v1/checkout/mobile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey,
          'X-Signature': this.generateHmacSignature(JSON.stringify(payload))
        },
        body: JSON.stringify(payload)
      });

      const data = (await res.json()) as any;
      if (res.ok && data.status === 'SUCCESS') {
        return {
          success: true,
          orderId: req.orderId,
          transactionRef: data.reference || transactionRef,
          providerCheckoutId: data.checkoutId || providerCheckoutId,
          status: 'processing',
          instructionMessage: `Push prompt sent to ${phone}. Enter your PIN to approve.`,
          requiresPolling: true,
          pollIntervalMs: 2000,
          rawResponse: data
        };
      } else {
        return {
          success: false,
          orderId: req.orderId,
          transactionRef,
          status: 'failed',
          instructionMessage: data.message || 'Payment initiation failed with mobile provider.',
          errorMessage: data.error || data.message
        };
      }
    } catch (err: any) {
      return {
        success: false,
        orderId: req.orderId,
        transactionRef,
        status: 'failed',
        instructionMessage: 'Communication error connecting to Sifalo Pay.',
        errorMessage: err.message
      };
    }
  }

  async verifyPayment(orderId: string, transactionRef: string, providerCheckoutId?: string): Promise<PaymentVerificationResult> {
    const sim = this.pendingSimulatedOrders.get(orderId);
    if (sim) {
      return {
        orderId,
        transactionRef,
        status: sim.status,
        providerTxId: sim.receipt,
        amount: 0,
        currency: 'USD',
        isSuccessful: sim.status === 'completed'
      };
    }

    return {
      orderId,
      transactionRef,
      status: 'completed',
      providerTxId: providerCheckoutId || `SIF_${Date.now()}`,
      amount: 0,
      currency: 'USD',
      isSuccessful: true
    };
  }

  async parseWebhook(headers: Record<string, string | string[] | undefined>, body: any): Promise<PaymentWebhookResult> {
    const signatureHeader = headers['x-sifalo-signature'] || headers['x-signature'];
    const payloadStr = typeof body === 'string' ? body : JSON.stringify(body);

    const receivedSig = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
    const computedSig = this.generateHmacSignature(payloadStr);

    let signatureValid = true;
    if (receivedSig && computedSig) {
      try {
        signatureValid = crypto.timingSafeEqual(Buffer.from(receivedSig), Buffer.from(computedSig));
      } catch {
        signatureValid = false;
      }
    }

    const orderId = body?.orderId || body?.metadata?.orderId;
    const transactionRef = body?.reference || body?.transactionRef;
    const providerTxId = body?.providerRef || body?.paymentId;
    const amount = Number(body?.amount || 0);
    const currency = (body?.currency || 'USD') as PaymentCurrency;
    const isSuccess = body?.status === 'SUCCESS' || body?.status === 'PAID';

    return {
      isValid: signatureValid,
      provider: 'sifalo',
      orderId,
      transactionRef,
      providerTxId,
      amount,
      currency,
      status: isSuccess ? 'completed' : 'failed',
      errorMessage: isSuccess ? undefined : (body?.errorMessage || 'Transaction unsuccessful'),
      rawPayload: body
    };
  }
}
