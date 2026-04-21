// 1. Interface attendue par notre application
export interface IPaymentProcessor {
  pay(amountInEuros: number): void;
}

// 2. Ancien systeme (Compatible avec notre interface)
export class LegacyPaypal implements IPaymentProcessor {
  public pay(amountInEuros: number): void {
    console.log(`Paiement de ${amountInEuros}€ via Paypal (Legacy).`);
  }
}

// 3. NOUVEAU systeme externe (INCOMPATIBLE !)
// Vous n'avez pas le droit de modifier cette classe car elle
// provient d'une librairie externe (npm install stripe).
export class StripeModernAPI {
  public charge(amountInCents: number, currency: string): void {
    console.log(`Paiement de ${amountInCents / 100} ${currency} via Stripe.`);
  }
}

// 4. Notre service metier
export class CheckoutService {
  private paymentProcessor: IPaymentProcessor;

  constructor(processor: IPaymentProcessor) {
    this.paymentProcessor = processor;
  }

  public checkout(cartTotal: number): void {
    console.log("Validation du panier...");
    // Le service ne sait utiliser QUE la methode pay()
    this.paymentProcessor.pay(cartTotal);
  }
}

// L'interface IPaymentProcessor, LegacyPaypal, StripeModernAPI
// et CheckoutService restent inchangés au-dessus.

// 1. Création de l'adaptateur
export class StripeAdapter implements IPaymentProcessor {
  private stripeApi: StripeModernAPI;

  constructor(stripeInstance: StripeModernAPI) {
    this.stripeApi = stripeInstance; // Encapsulation de l'instance Stripe
  }

  // Implémentation de la méthode imposée par l'interface
  public pay(amountInEuros: number): void {
    const amountInCents = amountInEuros * 100; // Conversion en centimes
    this.stripeApi.charge(amountInCents, "EUR"); // Appel avec la devise "EUR"
  }
}

// --- Nouvelle exécution ---
const stripeAPI = new StripeModernAPI();
const stripeAdapter = new StripeAdapter(stripeAPI);

// Le CheckoutService fonctionne parfaitement avec le nouvel adaptateur !
const checkout = new CheckoutService(stripeAdapter);
checkout.checkout(50);
