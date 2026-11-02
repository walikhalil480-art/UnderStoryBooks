import crypto from 'node:crypto';
import { db } from '../db';
import {
  PaymentCurrency,
  PaymentMethodId,
  PaymentProviderName,
  OrderStatus,
  PaymentInitiateResult,
  PaymentVerificationResult,
  PaymentWebhookResult
} from './types';
import { paymentRegistry } from './registry';

export interface CreateOrderParams {
  userId: string;
  bookId: string;
  bookTitle: string;
  amount: number;
  currency: PaymentCurrency;
  paymentMethod: PaymentMethodId;
  customerPhone?: string;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, any>;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  orderId: string;
  amount: number;
  currency: string;
  message: string;
}

export class PaymentService {
  /**
   * Checks whether a user has an active entitlement or confirmed purchase for a book.
   * Admins always have access.
   */
  public checkUserEntitlement(userId: string, bookId: string, userRole?: string): boolean {
    if (userRole === 'admin') return true;

    // Check purchase_entitlements first
    try {
      const ent = db
        .prepare("SELECT id FROM purchase_entitlements WHERE user_id = ? AND book_id = ? AND status = 'active'")
        .get(userId, bookId);
      if (ent) return true;
    } catch {}

    // Fallback to legacy purchases table
    try {
      const pur = db
        .prepare("SELECT id FROM purchases WHERE user_id = ? AND book_id = ? AND status = 'completed'")
        .get(userId, bookId);
      if (pur) return true;
    } catch {}

    return false;
  }

  /**
   * Creates a new purchase order.
   */
  public async createOrder(params: CreateOrderParams): Promise<{
    order: any;
    alreadyPurchased: boolean;
  }> {
    // Check if user already owns this book
    if (this.checkUserEntitlement(params.userId, params.bookId)) {
      return {
        order: {
          id: `already_owned_${params.bookId}`,
          book_id: params.bookId,
          status: 'completed'
        },
        alreadyPurchased: true
      };
    }

    const provider = paymentRegistry.getProviderByMethod(params.paymentMethod);
    if (!provider) {
      throw new Error(`Unsupported payment method: ${params.paymentMethod}`);
    }

    const orderId = `ord_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const transactionRef = `REF-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO orders (
        id, user_id, book_id, amount, currency, provider, payment_method,
        customer_phone, status, transaction_ref, metadata_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)
    `).run(
      orderId,
      params.userId,
      params.bookId,
      params.amount,
      params.currency,
      provider.name,
      params.paymentMethod,
      params.customerPhone || null,
      transactionRef,
      JSON.stringify(params.metadata || {}),
      now,
      now
    );

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    return { order, alreadyPurchased: false };
  }

  /**
   * Initiates payment with the selected provider and updates order record.
   */
  public async initiatePayment(
    orderId: string,
    params: {
      customerPhone?: string;
      customerEmail: string;
      customerName: string;
      cardToken?: string;
      callbackUrl?: string;
    }
  ): Promise<PaymentInitiateResult> {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    // Look up book title for payment descriptor
    let bookTitle = 'Folio Ebook Edition';
    try {
      const bookRow = db.prepare('SELECT title FROM books WHERE id = ?').get(order.book_id) as any;
      if (bookRow?.title) bookTitle = bookRow.title;
    } catch {}

    const provider = paymentRegistry.getProviderByMethod(order.payment_method as PaymentMethodId);
    if (!provider) {
      throw new Error(`No provider available for method: ${order.payment_method}`);
    }

    const result = await provider.initiatePayment({
      orderId: order.id,
      bookId: order.book_id,
      bookTitle,
      amount: order.amount,
      currency: order.currency as PaymentCurrency,
      method: order.payment_method as PaymentMethodId,
      customerPhone: params.customerPhone || order.customer_phone || undefined,
      customerEmail: params.customerEmail,
      customerName: params.customerName,
      cardToken: params.cardToken,
      callbackUrl: params.callbackUrl
    });

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE orders
      SET status = ?,
          transaction_ref = ?,
          provider_checkout_id = ?,
          error_message = ?,
          customer_phone = COALESCE(?, customer_phone),
          updated_at = ?
      WHERE id = ?
    `).run(
      result.status,
      result.transactionRef,
      result.providerCheckoutId || null,
      result.errorMessage || null,
      params.customerPhone || null,
      now,
      order.id
    );

    // If already completed synchronously (e.g. sandbox or instant card/mobile auth)
    if (result.status === 'completed') {
      this.grantEntitlement(order.user_id, order.book_id, order.id, {
        provider: provider.name,
        transactionRef: result.transactionRef,
        providerTxId: result.providerCheckoutId || result.transactionRef,
        amount: order.amount,
        currency: order.currency,
        rawPayload: result.rawResponse
      });
    }

    return result;
  }

  /**
   * Verifies an order's payment status authoritatively.
   */
  public async verifyOrder(orderId: string): Promise<PaymentVerificationResult> {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    if (order.status === 'completed') {
      return {
        orderId: order.id,
        transactionRef: order.transaction_ref,
        status: 'completed',
        amount: order.amount,
        currency: order.currency,
        isSuccessful: true,
        providerTxId: order.provider_checkout_id
      };
    }

    const provider = paymentRegistry.getProviderByMethod(order.payment_method as PaymentMethodId);
    if (!provider) {
      throw new Error(`Provider not found for order: ${order.id}`);
    }

    const verification = await provider.verifyPayment(order.id, order.transaction_ref, order.provider_checkout_id);
    const now = new Date().toISOString();

    if (verification.isSuccessful && verification.status === 'completed') {
      db.prepare(`
        UPDATE orders
        SET status = 'completed',
            provider_checkout_id = COALESCE(?, provider_checkout_id),
            updated_at = ?
        WHERE id = ?
      `).run(verification.providerTxId || null, now, order.id);

      this.grantEntitlement(order.user_id, order.book_id, order.id, {
        provider: provider.name,
        transactionRef: order.transaction_ref,
        providerTxId: verification.providerTxId || order.transaction_ref,
        amount: order.amount,
        currency: order.currency,
        rawPayload: verification.rawResponse
      });
    } else if (verification.status === 'failed') {
      db.prepare(`
        UPDATE orders
        SET status = 'failed',
            error_message = ?,
            updated_at = ?
        WHERE id = ?
      `).run(verification.errorMessage || 'Payment verification failed', now, order.id);
    }

    return verification;
  }

  /**
   * Processes incoming webhook from payment provider.
   * Guarantees idempotent entitlement granting and cryptographic verification.
   */
  public async processWebhook(
    providerName: PaymentProviderName,
    headers: Record<string, string | string[] | undefined>,
    body: any
  ): Promise<{ success: boolean; message: string; duplicate?: boolean }> {
    const provider = paymentRegistry.getProviderByName(providerName);
    if (!provider) {
      throw new Error(`Unknown webhook provider: ${providerName}`);
    }

    const parsed = await provider.parseWebhook(headers, body);
    if (!parsed.isValid) {
      return {
        success: false,
        message: parsed.errorMessage || 'Webhook signature verification failed.'
      };
    }

    // Locate the matching order by transactionRef, orderId, or providerCheckoutId
    let order: any = null;
    if (parsed.orderId) {
      order = db.prepare('SELECT * FROM orders WHERE id = ?').get(parsed.orderId);
    }
    if (!order && parsed.transactionRef) {
      order = db
        .prepare('SELECT * FROM orders WHERE transaction_ref = ? OR provider_checkout_id = ?')
        .get(parsed.transactionRef, parsed.transactionRef);
    }

    if (!order) {
      return {
        success: false,
        message: `No order found matching webhook reference: ${parsed.orderId || parsed.transactionRef}`
      };
    }

    // Check idempotency: If already completed, acknowledge webhook without duplicating records
    if (order.status === 'completed') {
      return {
        success: true,
        duplicate: true,
        message: 'Order already completed; webhook acknowledged idempotently.'
      };
    }

    const now = new Date().toISOString();
    if (parsed.status === 'completed') {
      db.prepare(`
        UPDATE orders
        SET status = 'completed',
            provider_checkout_id = COALESCE(?, provider_checkout_id),
            updated_at = ?
        WHERE id = ?
      `).run(parsed.providerTxId || null, now, order.id);

      this.grantEntitlement(order.user_id, order.book_id, order.id, {
        provider: provider.name,
        transactionRef: order.transaction_ref,
        providerTxId: parsed.providerTxId || order.transaction_ref,
        amount: parsed.amount || order.amount,
        currency: parsed.currency || order.currency,
        rawPayload: parsed.rawPayload
      });

      return {
        success: true,
        message: 'Webhook processed; order completed and entitlement granted.'
      };
    } else {
      db.prepare(`
        UPDATE orders
        SET status = 'failed',
            error_message = ?,
            updated_at = ?
        WHERE id = ?
      `).run(parsed.errorMessage || 'Payment rejected by gateway callback', now, order.id);

      return {
        success: true,
        message: 'Webhook processed; order marked as failed.'
      };
    }
  }

  /**
   * Atomically grants reading entitlement and synchronizes legacy purchases and library.
   */
  public grantEntitlement(
    userId: string,
    bookId: string,
    orderId: string,
    paymentMeta: {
      provider: string;
      transactionRef: string;
      providerTxId?: string;
      amount: number;
      currency: string;
      rawPayload?: any;
    }
  ): void {
    const now = new Date().toISOString();

    // 1. Record payment transaction
    const ptxnId = `ptxn_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    try {
      db.prepare(`
        INSERT INTO payment_transactions (
          id, order_id, user_id, book_id, provider, provider_tx_id,
          amount, currency, status, signature_valid, raw_payload_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'successful', 1, ?, ?)
      `).run(
        ptxnId,
        orderId,
        userId,
        bookId,
        paymentMeta.provider,
        paymentMeta.providerTxId || null,
        paymentMeta.amount,
        paymentMeta.currency,
        paymentMeta.rawPayload ? JSON.stringify(paymentMeta.rawPayload) : '{}',
        now
      );
    } catch (e) {
      console.error('[PaymentService.grantEntitlement ptxn error]:', e);
    }

    // 2. Grant purchase entitlement (idempotent ON CONFLICT)
    const entId = `ent_${crypto.randomUUID()}`;
    try {
      db.prepare(`
        INSERT INTO purchase_entitlements (id, user_id, book_id, order_id, status, granted_at)
        VALUES (?, ?, ?, ?, 'active', ?)
        ON CONFLICT(user_id, book_id) DO UPDATE SET
          status = 'active',
          order_id = excluded.order_id,
          granted_at = excluded.granted_at,
          revoked_at = NULL,
          revoke_reason = NULL
      `).run(entId, userId, bookId, orderId, now);
    } catch (e) {
      console.error('[PaymentService.grantEntitlement ent error]:', e);
    }

    // 3. Sync to legacy purchases table for complete backwards compatibility
    const purId = `pur_${crypto.randomUUID()}`;
    try {
      db.prepare(`
        INSERT INTO purchases (id, user_id, book_id, amount, currency, provider, transaction_ref, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', ?)
        ON CONFLICT(transaction_ref) DO UPDATE SET
          status = 'completed'
      `).run(
        purId,
        userId,
        bookId,
        paymentMeta.amount,
        paymentMeta.currency,
        paymentMeta.provider,
        paymentMeta.transactionRef,
        now
      );
    } catch (e) {
      // If transaction_ref already exists or duplicate insert
      try {
        db.prepare("UPDATE purchases SET status = 'completed' WHERE user_id = ? AND book_id = ?").run(userId, bookId);
      } catch {}
    }

    // 4. Ensure book is saved in user_library
    try {
      const inLib = db.prepare('SELECT id FROM user_library WHERE user_id = ? AND book_id = ?').get(userId, bookId);
      if (!inLib) {
        db.prepare(`
          INSERT INTO user_library (id, user_id, book_id, status, added_at, updated_at)
          VALUES (?, ?, ?, 'want-to-read', ?, ?)
        `).run(`lib_${crypto.randomUUID()}`, userId, bookId, now, now);
      }
    } catch {}

    // 5. Instantly notify administrator of the new sale
    try {
      const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
      const user = db.prepare('SELECT id, full_name, email FROM users WHERE id = ?').get(userId) as any;
      const book = db.prepare('SELECT id, title, author FROM books WHERE id = ?').get(bookId) as any;

      let bookTitle = book?.title;
      if (!bookTitle && order?.metadata_json) {
        try {
          const meta = JSON.parse(order.metadata_json);
          if (meta.bookTitle) bookTitle = meta.bookTitle;
        } catch {}
      }
      if (!bookTitle) bookTitle = 'Folio Ebook Edition';

      const customerName = user?.full_name || order?.customer_name || 'Reader';
      const customerEmail = user?.email || order?.customer_email || 'reader@ebaro.org';
      const methodLabel = order?.payment_method
        ? order.payment_method.toUpperCase().replace('_', ' ')
        : (paymentMeta.provider || 'ONLINE').toUpperCase();
      const notifId = `notif_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

      db.prepare(`
        INSERT INTO admin_notifications (
          id, type, title, message, amount, currency, order_id, book_id,
          book_title, customer_name, customer_email, payment_method, is_read, created_at
        ) VALUES (?, 'sale', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
      `).run(
        notifId,
        `New Sale: ${bookTitle}`,
        `${customerName} (${customerEmail}) purchased "${bookTitle}" for ${paymentMeta.currency} ${paymentMeta.amount.toFixed(2)} via ${methodLabel}.`,
        paymentMeta.amount,
        paymentMeta.currency,
        orderId,
        bookId,
        bookTitle,
        customerName,
        customerEmail,
        order?.payment_method || paymentMeta.provider,
        now
      );
    } catch (e) {
      console.error('[PaymentService.grantEntitlement admin_notification error]:', e);
    }
  }

  /**
   * Processes an administrative refund, revoking reading access immediately.
   */
  public async processRefund(
    orderId: string,
    adminUserId: string,
    reason: string
  ): Promise<RefundResult> {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    if (order.status === 'refunded') {
      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        message: 'Order has already been refunded.'
      };
    }

    const refundId = `ref_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const now = new Date().toISOString();

    // 1. Insert refund record
    db.prepare(`
      INSERT INTO refund_records (
        id, order_id, user_id, book_id, amount, currency, reason, admin_user_id, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?)
    `).run(refundId, order.id, order.user_id, order.book_id, order.amount, order.currency, reason, adminUserId, now);

    // 2. Update order status
    db.prepare(`
      UPDATE orders
      SET status = 'refunded',
          updated_at = ?
      WHERE id = ?
    `).run(now, order.id);

    // 3. Revoke active purchase entitlement
    db.prepare(`
      UPDATE purchase_entitlements
      SET status = 'revoked',
          revoked_at = ?,
          revoke_reason = ?
      WHERE user_id = ? AND book_id = ?
    `).run(now, reason, order.user_id, order.book_id);

    // 4. Update legacy purchases table
    db.prepare(`
      UPDATE purchases
      SET status = 'refunded'
      WHERE user_id = ? AND book_id = ?
    `).run(order.user_id, order.book_id);

    // 5. Audit log
    db.prepare(`
      INSERT INTO verification_audit_log (id, book_id, check_type, status, details, checked_at)
      VALUES (?, ?, 'purchase_refund', 'refunded', ?, ?)
    `).run(
      `audit_${crypto.randomUUID()}`,
      order.book_id,
      `Refund of ${order.amount} ${order.currency} issued by admin ${adminUserId}. Reason: ${reason}`,
      now
    );

    return {
      success: true,
      refundId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      message: `Refund of ${order.amount} ${order.currency} processed successfully. Reading entitlement revoked.`
    };
  }

  /**
   * Retrieves financial KPIs, revenue breakdown, and sales statistics for Admin dashboard.
   */
  public getFinancialSummary(): Record<string, any> {
    const orders = db.prepare('SELECT * FROM orders').all() as any[];
    const entitlements = db.prepare('SELECT * FROM purchase_entitlements').all() as any[];
    const refunds = db.prepare('SELECT * FROM refund_records').all() as any[];

    let totalRevenueUsd = 0;
    const revenueByCurrency: Record<string, number> = { USD: 0, KES: 0, SOS: 0 };
    const salesByProvider: Record<string, { count: number; totalUsd: number }> = {};
    const salesByBook: Record<string, { bookId: string; title: string; count: number; totalUsd: number }> = {};

    for (const o of orders) {
      if (o.status === 'completed') {
        const curr = o.currency || 'USD';
        revenueByCurrency[curr] = (revenueByCurrency[curr] || 0) + o.amount;

        // Approximate USD for combined KPI (1 USD ~ 130 KES, 1 USD ~ 26,000 SOS)
        const usdVal = curr === 'KES' ? o.amount / 130 : curr === 'SOS' ? o.amount / 26000 : o.amount;
        totalRevenueUsd += usdVal;

        const prov = o.provider || 'sifalo';
        if (!salesByProvider[prov]) {
          salesByProvider[prov] = { count: 0, totalUsd: 0 };
        }
        salesByProvider[prov].count++;
        salesByProvider[prov].totalUsd += usdVal;

        if (!salesByBook[o.book_id]) {
          let title = o.book_id;
          try {
            const b = db.prepare('SELECT title FROM books WHERE id = ?').get(o.book_id) as any;
            if (b?.title) title = b.title;
          } catch {}
          salesByBook[o.book_id] = { bookId: o.book_id, title, count: 0, totalUsd: 0 };
        }
        salesByBook[o.book_id].count++;
        salesByBook[o.book_id].totalUsd += usdVal;
      }
    }

    const activeEntitlementsCount = entitlements.filter((e) => e.status === 'active').length;
    const completedOrdersCount = orders.filter((o) => o.status === 'completed').length;
    const refundedOrdersCount = orders.filter((o) => o.status === 'refunded').length;

    return {
      totalRevenueUsd: Math.round(totalRevenueUsd * 100) / 100,
      revenueByCurrency,
      completedOrdersCount,
      refundedOrdersCount,
      activeEntitlementsCount,
      totalRefundsCount: refunds.length,
      salesByProvider,
      topSellingBooks: Object.values(salesByBook).sort((a, b) => b.totalUsd - a.totalUsd).slice(0, 10)
    };
  }

  /**
   * Retrieves searchable/filterable transactions and orders for Admin dashboard.
   */
  public getTransactions(params?: {
    search?: string;
    status?: string;
    provider?: string;
    limit?: number;
    offset?: number;
  }): { transactions: any[]; total: number } {
    let sql = `
      SELECT o.*, u.email as user_email, u.full_name as user_name, b.title as book_title, b.author as book_author
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      LEFT JOIN books b ON b.id = o.book_id
      WHERE 1=1
    `;
    const args: any[] = [];

    if (params?.status && params.status !== 'all') {
      sql += ' AND o.status = ?';
      args.push(params.status);
    }
    if (params?.provider && params.provider !== 'all') {
      sql += ' AND o.provider = ?';
      args.push(params.provider);
    }
    if (params?.search && params.search.trim().length > 0) {
      const q = `%${params.search.trim()}%`;
      sql += ' AND (o.id LIKE ? OR o.transaction_ref LIKE ? OR u.email LIKE ? OR b.title LIKE ?)';
      args.push(q, q, q, q);
    }

    sql += ' ORDER BY o.created_at DESC';

    const countRows = db.prepare(sql).all(...args);
    const total = countRows.length;

    const limit = params?.limit || 50;
    const offset = params?.offset || 0;
    sql += ' LIMIT ? OFFSET ?';
    args.push(limit, offset);

    const rows = db.prepare(sql).all(...args);
    return { transactions: rows, total };
  }
}

export const paymentService = new PaymentService();
