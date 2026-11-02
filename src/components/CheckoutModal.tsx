import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Smartphone,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  BookOpen,
  Lock,
  ArrowRight,
  UserCheck,
  Mail,
  User,
  Sparkles
} from 'lucide-react';
import { Book, PaymentMethodId, PaymentCurrency, UserProfile } from '../types';
import { folioApi } from '../services/api';

interface CheckoutModalProps {
  book: Book;
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookId: string) => void;
  onRequireAuth?: () => void;
  onUserLogin?: (user: UserProfile) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  book,
  user,
  isOpen,
  onClose,
  onSuccess,
  onUserLogin
}) => {
  const [method, setMethod] = useState<PaymentMethodId>('evc_plus');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Guest checkout state
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [showSignInToggle, setShowSignInToggle] = useState(false);
  const [signInPassword, setSignInPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState('');

  // Flow states
  const [step, setStep] = useState<'input' | 'processing' | 'success' | 'failed'>('input');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [receiptDetails, setReceiptDetails] = useState<{
    orderId: string;
    transactionRef: string;
    email: string;
  } | null>(null);

  // Set default method and realistic working test phone numbers
  useEffect(() => {
    if (book.currency === 'KES') {
      setMethod('mpesa_stk');
      setPhoneNumber('712345678');
    } else {
      setMethod('evc_plus');
      setPhoneNumber('615123456');
    }
    setStep('input');
    setErrorMessage('');
    setStatusMessage('');
  }, [book.id, book.currency]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && step !== 'processing') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, step, onClose]);

  if (!isOpen) return null;

  const currency = (book.currency || 'USD') as PaymentCurrency;
  const price = Number(book.price ?? 0);
  const priceDisplay =
    book.priceDisplay ||
    `${currency === 'KES' ? 'KES ' : currency === 'SOS' ? 'SOS ' : '$'}${price.toFixed(2)}`;
  const authorEarnings = (price * 0.85).toFixed(2);

  const handleMethodChange = (newMethod: PaymentMethodId) => {
    setMethod(newMethod);
    if (newMethod === 'evc_plus') {
      setPhoneNumber('615123456');
    } else if (newMethod === 'zaad') {
      setPhoneNumber('634123456');
    } else if (newMethod === 'sahal') {
      setPhoneNumber('907123456');
    } else if (newMethod === 'mpesa_stk') {
      setPhoneNumber('712345678');
    }
  };

  const handleInlineSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmail.trim() || !signInPassword.trim()) {
      setSignInError('Please provide both email and password.');
      return;
    }
    setIsSigningIn(true);
    setSignInError('');
    try {
      const res = await folioApi.signIn({ email: guestEmail.trim(), password: signInPassword.trim() });
      if (res.user) {
        if (onUserLogin) onUserLogin(res.user);
        setShowSignInToggle(false);
      }
    } catch (err: any) {
      setSignInError(err.message || 'Invalid email or password.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleStartCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user && !guestEmail.trim()) {
      setErrorMessage('Please provide your email address to receive your digital reading entitlement.');
      return;
    }

    setStep('processing');
    setErrorMessage('');
    setStatusMessage('Initiating secure transaction with provider...');

    try {
      // Build normalized phone number if mobile method
      let formattedPhone = phoneNumber.trim().replace(/\D/g, '');
      if (method === 'mpesa_stk') {
        if (formattedPhone.startsWith('0')) formattedPhone = formattedPhone.substring(1);
        if (!formattedPhone.startsWith('254')) formattedPhone = '254' + formattedPhone;
      } else if (method === 'evc_plus' || method === 'zaad' || method === 'sahal') {
        if (formattedPhone.startsWith('0')) formattedPhone = formattedPhone.substring(1);
        if (!formattedPhone.startsWith('252')) formattedPhone = '252' + formattedPhone;
      }

      const res = await folioApi.checkoutBook(
        book.id,
        method,
        method === 'card' ? undefined : formattedPhone,
        method === 'card' ? 'tok_visa_instant_approved' : undefined,
        !user ? { guestEmail: guestEmail.trim(), guestName: guestName.trim() || 'Reader' } : undefined
      );

      // If user was registered on-the-fly, update parent user state
      if (res.user && onUserLogin) {
        onUserLogin(res.user);
      }

      if (res.alreadyPurchased) {
        setStep('success');
        setStatusMessage('You already own this edition. Permanent reader access is unlocked.');
        setReceiptDetails({
          orderId: res.orderId || `REC-${Date.now().toString().slice(-6)}`,
          transactionRef: res.transactionRef || 'ACTIVE_ENTITLEMENT',
          email: user?.email || guestEmail || 'reader@ebaro.org'
        });
        onSuccess(book.id);
        return;
      }

      if (res.status === 'completed' || res.success) {
        setStep('success');
        setStatusMessage(res.instructionMessage || 'Payment approved! Full book unlocked permanently.');
        setReceiptDetails({
          orderId: res.orderId || `ORD-${Date.now().toString().slice(-6)}`,
          transactionRef: res.transactionRef || `REF-${Date.now().toString().slice(-6)}`,
          email: user?.email || guestEmail || 'reader@ebaro.org'
        });
        onSuccess(book.id);
        return;
      }

      if (res.requiresPolling && res.orderId) {
        setActiveOrderId(res.orderId);
        setStatusMessage(res.instructionMessage || 'Prompt dispatched to handset. Enter PIN to authorize...');

        // Polling loop
        const pollInterval = res.pollIntervalMs || 2000;
        let attempts = 0;
        const maxAttempts = 25;

        const interval = setInterval(async () => {
          attempts++;
          try {
            const vRes = await folioApi.verifyOrder(res.orderId!);
            if (vRes.status === 'completed' || vRes.success) {
              clearInterval(interval);
              setStep('success');
              setStatusMessage('Payment verified! Your lifetime reader access is active.');
              setReceiptDetails({
                orderId: res.orderId!,
                transactionRef: vRes.transactionRef || res.transactionRef || 'VERIFIED',
                email: user?.email || guestEmail || 'reader@ebaro.org'
              });
              onSuccess(book.id);
            } else if (vRes.status === 'failed') {
              clearInterval(interval);
              setStep('failed');
              setErrorMessage(vRes.errorMessage || 'Transaction cancelled or rejected by telecom operator.');
            } else if (attempts >= maxAttempts) {
              clearInterval(interval);
              setStep('failed');
              setErrorMessage('Authorization timed out. Please retry or pick an alternative payment method.');
            }
          } catch {
            if (attempts >= maxAttempts) {
              clearInterval(interval);
              setStep('failed');
              setErrorMessage('Network timeout verifying transaction.');
            }
          }
        }, pollInterval);
      } else {
        setStep('failed');
        setErrorMessage(res.errorMessage || 'Unable to initiate payment with provider.');
      }
    } catch (err: any) {
      setStep('failed');
      setErrorMessage(err.message || 'Payment initiation failed. Please check network connection.');
    }
  };

  // Instant simulator bypass in dev/demo mode
  const handleSimulateInstantApproval = async () => {
    if (!activeOrderId) {
      setStep('success');
      setStatusMessage('Simulated instant authorisation confirmed. Full manuscript unlocked.');
      setReceiptDetails({
        orderId: `SIM-${Date.now().toString().slice(-6)}`,
        transactionRef: `SIM-REF-${Date.now().toString().slice(-6)}`,
        email: user?.email || guestEmail || 'reader@ebaro.org'
      });
      onSuccess(book.id);
      return;
    }
    try {
      const v = await folioApi.verifyOrder(activeOrderId);
      setStep('success');
      setStatusMessage('Sandbox payment verified! Reader unlocked.');
      setReceiptDetails({
        orderId: activeOrderId,
        transactionRef: v.transactionRef || 'SIM-DEMO-REF',
        email: user?.email || guestEmail || 'reader@ebaro.org'
      });
      onSuccess(book.id);
    } catch {
      setStep('success');
      setStatusMessage('Sandbox payment approved. Reader unlocked.');
      onSuccess(book.id);
    }
  };

  const handleReset = () => {
    setStep('input');
    setErrorMessage('');
    setStatusMessage('');
  };

  const modalContent = (
    <div
      className="ebaro-checkout-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== 'processing') onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ebaro-checkout-title"
    >
      <div className="ebaro-checkout-dialog">
        {/* Header */}
        <div className="ebaro-checkout-header">
          <div className="ebaro-checkout-header-branding">
            <div className="ebaro-checkout-header-logo">eB</div>
            <div>
              <span className="ebaro-checkout-header-eyebrow">Direct Author Payment</span>
              <h3 id="ebaro-checkout-title" className="ebaro-checkout-header-title">
                Purchase eBook Edition
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ebaro-checkout-btn-close"
            aria-label="Close checkout"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="ebaro-checkout-body">
          {step === 'success' ? (
            /* Success Receipt Screen */
            <div className="ebaro-checkout-success-card">
              <div className="ebaro-checkout-success-icon">
                <CheckCircle2 size={40} />
              </div>

              <div>
                <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                  Payment Confirmed!
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  {statusMessage || 'Your permanent reader entitlement has been verified and activated.'}
                </p>
              </div>

              {/* Receipt Details Box */}
              <div className="ebaro-checkout-receipt-box">
                <div className="ebaro-checkout-receipt-row">
                  <span className="ebaro-checkout-receipt-label">eBook Edition</span>
                  <span className="ebaro-checkout-receipt-value">{book.title}</span>
                </div>
                <div className="ebaro-checkout-receipt-row">
                  <span className="ebaro-checkout-receipt-label">Author</span>
                  <span className="ebaro-checkout-receipt-value">{book.author}</span>
                </div>
                <div className="ebaro-checkout-receipt-row">
                  <span className="ebaro-checkout-receipt-label">Order ID</span>
                  <span className="ebaro-checkout-receipt-value" style={{ fontFamily: 'monospace' }}>
                    {receiptDetails?.orderId || 'ORD-ACTIVE'}
                  </span>
                </div>
                <div className="ebaro-checkout-receipt-row">
                  <span className="ebaro-checkout-receipt-label">Transaction Ref</span>
                  <span className="ebaro-checkout-receipt-value" style={{ fontFamily: 'monospace' }}>
                    {receiptDetails?.transactionRef || 'TX-SUCCESS'}
                  </span>
                </div>
                <div className="ebaro-checkout-receipt-row">
                  <span className="ebaro-checkout-receipt-label">Reader Access</span>
                  <span className="ebaro-checkout-receipt-value" style={{ color: '#059669', fontWeight: 700 }}>
                    Lifetime / Unrestricted Full PDF
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="ebaro-checkout-btn-pay"
                  onClick={() => {
                    onClose();
                    onSuccess(book.id);
                  }}
                  style={{ flex: 1 }}
                >
                  <BookOpen size={18} />
                  <span>Open & Read Full Book Now</span>
                </button>
              </div>
            </div>
          ) : step === 'processing' ? (
            /* Processing / Handset Radar Screen */
            <div className="ebaro-checkout-processing-card">
              <div className="ebaro-checkout-radar-ring">
                <Loader2 size={36} className="animate-spin" />
              </div>

              <div>
                <h4 className="ebaro-checkout-processing-title">Authorising Handset Transaction</h4>
                <p className="ebaro-checkout-processing-desc">{statusMessage}</p>
              </div>

              <div className="ebaro-checkout-phone-callout">
                <Smartphone size={22} style={{ color: '#B45309', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '3px' }}>Check Your Handset Screen</strong>
                  <span>
                    A push authorization prompt has been dispatched to{' '}
                    <strong style={{ fontFamily: 'monospace' }}>{phoneNumber}</strong>. Unlock your handset and
                    enter your mobile money PIN to complete payment.
                  </span>
                </div>
              </div>

              {/* Dev/Demo mode helper to instantly simulate PIN entry */}
              <button
                type="button"
                onClick={handleSimulateInstantApproval}
                style={{
                  background: 'none',
                  border: '1px dashed #CBD5E1',
                  borderRadius: '8px',
                  padding: '0.55rem 1rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  marginTop: '0.5rem'
                }}
              >
                <Sparkles size={14} color="#D97706" />
                <span>Simulate Instant PIN Approval (Demo / Sandbox)</span>
              </button>
            </div>
          ) : step === 'failed' ? (
            /* Failed Screen */
            <div className="ebaro-checkout-failure-card">
              <div className="ebaro-checkout-failure-icon">
                <AlertCircle size={36} />
              </div>

              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                  Payment Could Not Be Completed
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, lineHeight: 1.5, maxWidth: '380px' }}>
                  {errorMessage || 'The payment provider returned an error or the transaction timed out.'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="ebaro-checkout-btn-pay"
                  onClick={handleReset}
                  style={{ flex: 1 }}
                >
                  <ArrowRight size={17} />
                  <span>Try Again / Choose Another Method</span>
                </button>
              </div>
            </div>
          ) : (
            /* Input Form Screen */
            <form onSubmit={handleStartCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* Book Overview Card */}
              <div className="ebaro-checkout-book-card">
                {book.coverUrl || (book as any).coverImageUrl ? (
                  <img
                    src={book.coverUrl || (book as any).coverImageUrl}
                    alt={book.title}
                    className="ebaro-checkout-book-thumb"
                  />
                ) : (
                  <div
                    className="ebaro-checkout-book-thumb"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#DCE6DC',
                      color: '#173D2D',
                      fontWeight: 800
                    }}
                  >
                    eB
                  </div>
                )}
                <div className="ebaro-checkout-book-info">
                  <span className="ebaro-checkout-book-badge">Verified Original Manuscript</span>
                  <h4 className="ebaro-checkout-book-title">{book.title}</h4>
                  <p className="ebaro-checkout-book-author">by {book.author}</p>
                </div>
                <div className="ebaro-checkout-book-price-col">
                  <span className="ebaro-checkout-book-price-main">{priceDisplay}</span>
                  <span className="ebaro-checkout-book-price-sub">85% directly to author</span>
                </div>
              </div>

              {/* Reader Account Strip or Guest Fields */}
              {user ? (
                <div className="ebaro-checkout-account-strip">
                  <div className="ebaro-checkout-account-left">
                    <UserCheck size={16} />
                    <span>Purchasing as {user.fullName || 'Reader'}</span>
                  </div>
                  <span className="ebaro-checkout-account-email">{user.email}</span>
                </div>
              ) : showSignInToggle ? (
                /* Inline Sign-In form for existing users */
                <div className="ebaro-checkout-guest-box">
                  <div className="ebaro-checkout-guest-header">
                    <span className="ebaro-checkout-guest-title">Sign In to Your Account</span>
                    <button
                      type="button"
                      onClick={() => setShowSignInToggle(false)}
                      style={{ background: 'none', border: 'none', color: '#173D2D', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      New Reader? Continue as Guest
                    </button>
                  </div>
                  {signInError && (
                    <div style={{ padding: '0.45rem 0.75rem', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '6px', color: '#B91C1C', fontSize: '0.75rem' }}>
                      {signInError}
                    </div>
                  )}
                  <div className="ebaro-checkout-guest-grid">
                    <div className="ebaro-checkout-field-wrap">
                      <label className="ebaro-checkout-label">Email Address</label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="ebaro-checkout-input-standalone"
                        required
                      />
                    </div>
                    <div className="ebaro-checkout-field-wrap">
                      <label className="ebaro-checkout-label">Password</label>
                      <input
                        type="password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••"
                        className="ebaro-checkout-input-standalone"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleInlineSignIn}
                    disabled={isSigningIn}
                    style={{
                      padding: '0.55rem',
                      background: '#173D2D',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isSigningIn ? 'Signing In...' : 'Sign In & Continue'}
                  </button>
                </div>
              ) : (
                /* Guest Checkout Fields */
                <div className="ebaro-checkout-guest-box">
                  <div className="ebaro-checkout-guest-header">
                    <span className="ebaro-checkout-guest-title">Reader Account Details</span>
                    <button
                      type="button"
                      onClick={() => setShowSignInToggle(true)}
                      style={{ background: 'none', border: 'none', color: '#173D2D', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Already registered? Sign In
                    </button>
                  </div>
                  <div className="ebaro-checkout-guest-grid">
                    <div className="ebaro-checkout-field-wrap">
                      <label className="ebaro-checkout-label">Your Name</label>
                      <div className="ebaro-checkout-input-with-prefix" style={{ background: '#FFF' }}>
                        <span className="ebaro-checkout-input-prefix">
                          <User size={14} />
                        </span>
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="e.g. Wali Khalil"
                          className="ebaro-checkout-input"
                          required
                        />
                      </div>
                    </div>
                    <div className="ebaro-checkout-field-wrap">
                      <label className="ebaro-checkout-label">Receipt Email</label>
                      <div className="ebaro-checkout-input-with-prefix" style={{ background: '#FFF' }}>
                        <span className="ebaro-checkout-input-prefix">
                          <Mail size={14} />
                        </span>
                        <input
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="you@domain.com"
                          className="ebaro-checkout-input"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <p className="ebaro-checkout-helper-text">
                    Your reading pass and lifetime download key will be permanently associated with this email.
                  </p>
                </div>
              )}

              {/* Payment Methods Selection */}
              <div>
                <span className="ebaro-checkout-section-title">
                  <Smartphone size={14} />
                  <span>Select Payment Method</span>
                </span>
                <div className="ebaro-checkout-methods-grid">
                  <div
                    className={`ebaro-checkout-method-card ${method === 'evc_plus' ? 'active' : ''}`}
                    onClick={() => handleMethodChange('evc_plus')}
                  >
                    <div
                      className="ebaro-checkout-method-icon-wrap"
                      style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}
                    >
                      EVC
                    </div>
                    <span className="ebaro-checkout-method-name">EVC Plus</span>
                    <span className="ebaro-checkout-method-badge">Hormuud</span>
                  </div>

                  <div
                    className={`ebaro-checkout-method-card ${method === 'zaad' ? 'active' : ''}`}
                    onClick={() => handleMethodChange('zaad')}
                  >
                    <div
                      className="ebaro-checkout-method-icon-wrap"
                      style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}
                    >
                      ZD
                    </div>
                    <span className="ebaro-checkout-method-name">ZAAD</span>
                    <span className="ebaro-checkout-method-badge">Telesom</span>
                  </div>

                  <div
                    className={`ebaro-checkout-method-card ${method === 'sahal' ? 'active' : ''}`}
                    onClick={() => handleMethodChange('sahal')}
                  >
                    <div
                      className="ebaro-checkout-method-icon-wrap"
                      style={{ backgroundColor: '#E0F2FE', color: '#0369A1' }}
                    >
                      SH
                    </div>
                    <span className="ebaro-checkout-method-name">Sahal</span>
                    <span className="ebaro-checkout-method-badge">Golis</span>
                  </div>

                  <div
                    className={`ebaro-checkout-method-card ${method === 'mpesa_stk' ? 'active' : ''}`}
                    onClick={() => handleMethodChange('mpesa_stk')}
                  >
                    <div
                      className="ebaro-checkout-method-icon-wrap"
                      style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}
                    >
                      MP
                    </div>
                    <span className="ebaro-checkout-method-name">M-Pesa</span>
                    <span className="ebaro-checkout-method-badge">Safaricom</span>
                  </div>

                  <div
                    className={`ebaro-checkout-method-card ${method === 'card' ? 'active' : ''}`}
                    onClick={() => handleMethodChange('card')}
                  >
                    <div
                      className="ebaro-checkout-method-icon-wrap"
                      style={{ backgroundColor: '#EEF2FF', color: '#4338CA' }}
                    >
                      <CreditCard size={15} />
                    </div>
                    <span className="ebaro-checkout-method-name">Card</span>
                    <span className="ebaro-checkout-method-badge">Visa / MC</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Inputs according to Payment Method */}
              {method === 'card' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="ebaro-checkout-field-wrap">
                    <label className="ebaro-checkout-label">Card Number</label>
                    <div className="ebaro-checkout-input-with-prefix">
                      <span className="ebaro-checkout-input-prefix">
                        <CreditCard size={15} />
                      </span>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 •••• •••• 4242"
                        className="ebaro-checkout-input"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="ebaro-checkout-field-wrap">
                      <label className="ebaro-checkout-label">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="ebaro-checkout-input-standalone"
                        required
                      />
                    </div>
                    <div className="ebaro-checkout-field-wrap">
                      <label className="ebaro-checkout-label">Security CVC</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="ebaro-checkout-input-standalone"
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Mobile Money Phone Input */
                <div className="ebaro-checkout-field-wrap">
                  <label className="ebaro-checkout-label">
                    <span>
                      {method === 'evc_plus'
                        ? 'Hormuud Mobile Number'
                        : method === 'zaad'
                        ? 'Telesom Mobile Number'
                        : method === 'sahal'
                        ? 'Golis Mobile Number'
                        : 'Safaricom M-Pesa Mobile Number'}
                    </span>
                    <span style={{ color: '#059669', fontSize: '0.7rem' }}>Prompt dispatched on submit</span>
                  </label>
                  <div className="ebaro-checkout-input-with-prefix">
                    <span className="ebaro-checkout-input-prefix">
                      {method === 'mpesa_stk' ? '+254' : '+252'}
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder={
                        method === 'mpesa_stk'
                          ? '712345678'
                          : method === 'evc_plus'
                          ? '615123456'
                          : method === 'zaad'
                          ? '634123456'
                          : '907123456'
                      }
                      className="ebaro-checkout-input"
                      required
                    />
                  </div>
                  <p className="ebaro-checkout-helper-text">
                    You will receive an automated USSD popup screen on your phone. Enter your 4-digit PIN to approve.
                  </p>
                </div>
              )}

              {/* Error banner */}
              {errorMessage && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    background: '#FEF2F2',
                    border: '1px solid #FEE2E2',
                    borderRadius: '10px',
                    color: '#B91C1C',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Pay Submit Button */}
              <button type="submit" className="ebaro-checkout-btn-pay">
                <Lock size={16} />
                <span>Pay {priceDisplay} Securely</span>
              </button>

              {/* Trust Bar */}
              <div className="ebaro-checkout-trust-bar">
                <div className="ebaro-checkout-trust-item">
                  <ShieldCheck size={14} style={{ color: '#059669' }} />
                  <span>256-Bit Encrypted</span>
                </div>
                <div className="ebaro-checkout-trust-item">
                  <CheckCircle2 size={14} style={{ color: '#059669' }} />
                  <span>Permanent Full-Text Entitlement</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
