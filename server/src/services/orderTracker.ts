// 1. Création de l'interface Observer
export interface IOrderObserver {
  update(status: string): void;
}

// 2. Modification des services
class PushNotificationService implements IOrderObserver {
  public update(status: string): void {
    console.log(`[PUSH] Votre commande est desormais : ${status}`);
  }
}

class CRMService implements IOrderObserver {
  public update(status: string): void {
    console.log(`[CRM] Historique mis a jour avec le statut : ${status}`);
  }
}

class EmailService implements IOrderObserver {
  public update(status: string): void {
    console.log(`[EMAIL] Email envoye : Statut de commande = ${status}`);
  }
}

// 3. Le Suivi de Commande
export class OrderTracker {
  private status: string = "EN_ATTENTE";
  private observers: IOrderObserver[] = []; // Tableau d'observateurs

  public attach(observer: IOrderObserver): void {
    this.observers.push(observer);
  }

  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this.status);
    }
  }

  public setStatus(newStatus: string): void {
    this.status = newStatus;
    console.log(`\n--- Le statut de la commande passe a : ${this.status} ---`);
    this.notifyObservers(); // Remplacement des appels directs
  }
}

const tracker = new OrderTracker();

tracker.attach(new PushNotificationService());
tracker.attach(new CRMService());
tracker.attach(new EmailService());

tracker.setStatus("EXPEDIEE");
