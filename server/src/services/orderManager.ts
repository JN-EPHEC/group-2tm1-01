// 1. Création des DTO
export interface UserDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

export interface OrderItemDTO {
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  discountCode: string;
}

class PricingService {
  public calculateFinalPrice(
    price: number,
    quantity: number,
    discountCode: string,
  ): number {
    let finalPrice = price * quantity;

    if (discountCode === "SUMMER20") {
      finalPrice *= 0.8;
    } else if (discountCode === "WELCOME10") {
      finalPrice *= 0.9;
    }

    return finalPrice * 1.21; // Ajout de 21% de TVA
  }
}

class EmailService {
  public sendOrderConfirmation(
    email: string,
    quantity: number,
    productName: string,
    total: number,
  ): void {
    console.log("Connexion au serveur SMTP...");
    console.log(
      `Envoi de l'email à ${email}: Votre commande pour ${quantity}x ${productName} est confirmée. Total: ${total}€.`,
    );
  }

  public sendRefundConfirmation(amount: number): void {
    console.log("Connexion au serveur SMTP...");
    console.log(`Envoi de l'email de remboursement. Montant: ${amount}€.`);
  }
}

export class OrderManager {
  private pricingService = new PricingService();
  private emailService = new EmailService();

  public processOrder(
    user: UserDTO,
    item: OrderItemDTO,
    productStock: number,
  ): number {
    if (!user.email.includes("@") || user.firstName === "") {
      throw new Error("Utilisateur invalide");
    }
    if (item.quantity > productStock) {
      throw new Error("Stock insuffisant");
    }

    // Appel du service pour le calcul
    const finalPrice = this.pricingService.calculateFinalPrice(
      item.productPrice,
      item.quantity,
      item.discountCode,
    );

    // Mise à jour du stock
    productStock -= item.quantity;

    // Appel du service pour l'email
    this.emailService.sendOrderConfirmation(
      user.email,
      item.quantity,
      item.productName,
      finalPrice,
    );

    return finalPrice;
  }

  public calculateRefund(item: OrderItemDTO): number {
    const refundAmount = this.pricingService.calculateFinalPrice(
      item.productPrice,
      item.quantity,
      item.discountCode,
    );
    this.emailService.sendRefundConfirmation(refundAmount);
    return refundAmount;
  }
}
