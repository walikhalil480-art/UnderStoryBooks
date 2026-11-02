import { IPaymentProvider, PaymentMethodId, PaymentProviderName, PaymentCurrency } from './types';
import { MpesaDarajaProvider } from './providers/mpesaDarajaProvider';
import { SifaloPayProvider } from './providers/sifaloPayProvider';
import { CardProvider } from './providers/cardProvider';

export interface PaymentMethodOption {
  id: PaymentMethodId;
  name: string;
  provider: PaymentProviderName;
  currencies: PaymentCurrency[];
  icon: string;
  country: string;
  description: string;
  isPopular?: boolean;
}

export class PaymentRegistry {
  private providers = new Map<PaymentProviderName, IPaymentProvider>();

  constructor() {
    this.registerProvider(new MpesaDarajaProvider());
    this.registerProvider(new SifaloPayProvider());
    this.registerProvider(new CardProvider());
  }

  public registerProvider(provider: IPaymentProvider) {
    this.providers.set(provider.name, provider);
  }

  public getProviderByName(name: PaymentProviderName): IPaymentProvider | undefined {
    return this.providers.get(name);
  }

  public getProviderByMethod(method: PaymentMethodId): IPaymentProvider | undefined {
    for (const provider of this.providers.values()) {
      if (provider.supportedMethods.includes(method)) {
        return provider;
      }
    }
    return undefined;
  }

  public getAvailableMethods(currency: PaymentCurrency = 'USD'): PaymentMethodOption[] {
    const allMethods: PaymentMethodOption[] = [
      {
        id: 'evc_plus',
        name: 'EVC Plus',
        provider: 'sifalo',
        currencies: ['USD', 'SOS'],
        icon: 'Smartphone',
        country: 'Somalia',
        description: 'Hormuud Mobile Money instant USSD/STK push prompt',
        isPopular: true
      },
      {
        id: 'zaad',
        name: 'ZAAD Service',
        provider: 'sifalo',
        currencies: ['USD', 'SOS'],
        icon: 'Smartphone',
        country: 'Somaliland / Somalia',
        description: 'Telesom Mobile Money prompt',
        isPopular: true
      },
      {
        id: 'sahal',
        name: 'Sahal',
        provider: 'sifalo',
        currencies: ['USD', 'SOS'],
        icon: 'Smartphone',
        country: 'Puntland / Somalia',
        description: 'Golis Mobile Money prompt'
      },
      {
        id: 'mpesa_stk',
        name: 'M-Pesa Express',
        provider: 'mpesa',
        currencies: ['KES', 'USD'],
        icon: 'Smartphone',
        country: 'Kenya / East Africa',
        description: 'Safaricom M-Pesa instant STK Push PIN prompt',
        isPopular: true
      },
      {
        id: 'card',
        name: 'Credit or Debit Card',
        provider: 'card',
        currencies: ['USD', 'KES'],
        icon: 'CreditCard',
        country: 'Global',
        description: 'Visa, Mastercard, American Express'
      }
    ];

    return allMethods.filter((m) => m.currencies.includes(currency));
  }
}

export const paymentRegistry = new PaymentRegistry();
