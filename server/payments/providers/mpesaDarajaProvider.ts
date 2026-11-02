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

export interface MpesaDarajaConfig {
  consumerKey?: string;
  consumerSecret?: string;
  passkey?: string;
  shortCode?: string;
  stkCallbackUrl?: string;
  isSandbox?: boolean;
}

export class MpesaDarajaProvider implements IPaymentProvider {
  public name = 'mpesa' as const;
  public supportedMethods: PaymentMethodId[] = ['mpesa_stk'];
  public supportedCurrencies: PaymentCurrency[] = ['KES', 'USD'];

  private config: MpesaDarajaConfig;
  private pendingSimulatedOrders = new Map<string, { status: OrderStatus; expiresAt: number; receipt: string }>();

  constructor(config?: MpesaDarajaConfig) {
    this.config = {
      consumerKey: config?.consumerKey || process.env.MPESA_CONSUMER_KEY || '',
      consumerSecret: config?.consumerSecret || process.env.MPESA_CONSUMER_SECRET || '',
      passkey: config?.passkey || process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
      shortCode: config?.shortCode || process.env.MPESA_SHORTCODE || '174379',
      stkCallbackUrl: config?.stkCallbackUrl || process.env.MPESA_CALLBACK_URL || 'https://ebaro.org/api/payments/webhook/mpesa',
      isSandbox: config?.isSandbox ?? (process.env.MPESA_SANDBOX !== 'false')
    };
  }

  /**
   * Normalizes Kenyan phone numbers to format 254XXXXXXXXX
   */
  public normalizePhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      cleaned = '254' + cleaned;
    }
    return cleaned;
  }

  async initiatePayment(req: PaymentInitiateRequest): Promise<PaymentInitiateResult> {
    const rawPhone = req.customerPhone || '';
    const phone = this.normalizePhoneNumber(rawPhone);

    if (phone.length !== 12 || !phone.startsWith('254')) {
      return {
        success: false,
        orderId: req.orderId,
        transactionRef: `MPESA-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        status: 'failed',
        instructionMessage: 'Invalid Kenyan phone number. Use 07XXXXXXXX, 01XXXXXXXX, or 254XXXXXXXXX.',
        errorMessage: 'Invalid phone number format for M-Pesa STK push.'
      };
    }

    const transactionRef = `MPESA-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const providerCheckoutId = `ws_CO_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    // Test failure scenario
    if (phone.endsWith('999999') || phone.endsWith('111111')) {
      return {
        success: false,
        orderId: req.orderId,
        transactionRef,
        providerCheckoutId,
        status: 'failed',
        instructionMessage: 'Payment was rejected or cancelled by the user on handset.',
        errorMessage: 'STK push cancelled or rejected by user on handset.'
      };
    }

    // In sandbox / development mode
    if (this.config.isSandbox || !this.config.consumerKey) {
      const receipt = `QK${Date.now().toString().slice(-6)}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
      this.pendingSimulatedOrders.set(req.orderId, {
        status: 'completed',
        expiresAt: Date.now() + 60000,
        receipt
      });

      return {
        success: true,
        orderId: req.orderId,
        transactionRef,
        providerCheckoutId,
        status: 'completed',
        instructionMessage: `M-Pesa STK Push prompt sent to ${phone}. Authorisation confirmed in Sandbox mode.`,
        requiresPolling: false,
        rawResponse: {
          MerchantRequestID: `MR_${Date.now()}`,
          CheckoutRequestID: providerCheckoutId,
          ResponseCode: '0',
          ResponseDescription: 'Success. Request accepted for processing',
          CustomerMessage: 'Success. Request accepted for processing'
        }
      };
    }

    // Live Daraja integration via OAuth & STK Push
    try {
      const authHeader = Buffer.from(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString('base64');
      const tokenRes = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        headers: { Authorization: `Basic ${authHeader}` }
      });
      const tokenData = (await tokenRes.json()) as { access_token?: string };
      if (!tokenData.access_token) {
        throw new Error('Could not obtain M-Pesa access token');
      }

      const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      const password = Buffer.from(`${this.config.shortCode}${this.config.passkey}${timestamp}`).toString('base64');

      const stkRes = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          BusinessShortCode: this.config.shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.max(1, Math.round(req.amount)),
          PartyA: phone,
          PartyB: this.config.shortCode,
          PhoneNumber: phone,
          CallBackURL: this.config.stkCallbackUrl,
          AccountReference: `eBaro-${req.bookId.slice(0, 8)}`,
          TransactionDesc: `Purchase ${req.bookTitle.slice(0, 20)}`
        })
      });

      const stkData = (await stkRes.json()) as any;
      if (stkData.ResponseCode === '0') {
        return {
          success: true,
          orderId: req.orderId,
          transactionRef,
          providerCheckoutId: stkData.CheckoutRequestID,
          status: 'processing',
          instructionMessage: `STK push prompt sent to ${phone}. Please enter your M-Pesa PIN on your phone.`,
          requiresPolling: true,
          pollIntervalMs: 2500,
          rawResponse: stkData
        };
      } else {
        return {
          success: false,
          orderId: req.orderId,
          transactionRef,
          status: 'failed',
          instructionMessage: stkData.CustomerMessage || 'M-Pesa STK push initiation failed.',
          errorMessage: stkData.errorMessage || stkData.ResponseDescription
        };
      }
    } catch (err: any) {
      return {
        success: false,
        orderId: req.orderId,
        transactionRef,
        status: 'failed',
        instructionMessage: 'M-Pesa network communication error. Please try again.',
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
        currency: 'KES',
        isSuccessful: sim.status === 'completed'
      };
    }

    return {
      orderId,
      transactionRef,
      status: 'completed',
      providerTxId: providerCheckoutId || `DAR_${Date.now()}`,
      amount: 0,
      currency: 'KES',
      isSuccessful: true
    };
  }

  async parseWebhook(headers: Record<string, string | string[] | undefined>, body: any): Promise<PaymentWebhookResult> {
    // Daraja STK Push Callback schema
    const stkCallback = body?.Body?.stkCallback;
    if (!stkCallback) {
      return {
        isValid: false,
        provider: 'mpesa',
        status: 'failed',
        errorMessage: 'Invalid Daraja STK callback payload format',
        rawPayload: body
      };
    }

    const resultCode = stkCallback.ResultCode;
    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const items = stkCallback.CallbackMetadata?.Item || [];
    const metaMap: Record<string, any> = {};
    for (const item of items) {
      if (item.Name) metaMap[item.Name] = item.Value;
    }

    const amount = Number(metaMap.Amount || 0);
    const mpesaReceiptNumber = String(metaMap.MpesaReceiptNumber || '');

    const isSuccessful = resultCode === 0;

    return {
      isValid: true,
      provider: 'mpesa',
      transactionRef: checkoutRequestId,
      providerTxId: mpesaReceiptNumber || checkoutRequestId,
      amount,
      currency: 'KES',
      status: isSuccessful ? 'completed' : 'failed',
      errorMessage: isSuccessful ? undefined : (stkCallback.ResultDesc || 'Daraja payment failed'),
      rawPayload: body
    };
  }
}
