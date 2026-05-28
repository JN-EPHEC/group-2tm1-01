import {
  updateOrderStatus,
  createOrder,
  getOrders,
  getOrderById,
  deleteOrder,
} from "../services/order.service";

const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockOrder = jest.fn();
const mockSingle = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockInsert = jest.fn();

const mockChain = {
  select: mockSelect,
  eq: mockEq,
  order: mockOrder,
  single: mockSingle,
  update: mockUpdate,
  delete: mockDelete,
  insert: mockInsert,
};

jest.mock("../config/supabase", () => ({
  supabase: {
    from: jest.fn(() => mockChain),
  },
}));

describe("Order Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSelect.mockReturnValue(mockChain);
    mockEq.mockReturnValue(mockChain);
    mockOrder.mockReturnValue(mockChain);
    mockSingle.mockReturnValue(mockChain);
    mockUpdate.mockReturnValue(mockChain);
    mockDelete.mockReturnValue(mockChain);
    mockInsert.mockReturnValue(mockChain);
  });

  describe("updateOrderStatus", () => {
    it("devrait lever une erreur si le statut est invalide", async () => {
      await expect(updateOrderStatus(1, "statut_inconnu")).rejects.toThrow(
        "Statut invalide",
      );
    });

    it("devrait mettre à jour la commande si le statut est valide", async () => {
      const mockData = { id: 1, status: "paid" };
      mockSingle.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await updateOrderStatus(1, "paid");
      expect(result).toEqual(mockData);
    });
  });

  describe("createOrder", () => {
    it("devrait bloquer une commande si les informations client sont manquantes", async () => {
      const orderIncomplete = { address: "", paymentMethod: "" };
      await expect(createOrder("user123", orderIncomplete)).rejects.toThrow(
        "Informations client manquantes",
      );
    });

    it("devrait bloquer une commande si le panier est vide", async () => {
      const orderVide = {
        address: "123 Rue de la Kiné",
        paymentMethod: "Bancontact",
        items: [],
      };
      await expect(createOrder("user123", orderVide)).rejects.toThrow(
        "Le panier est vide",
      );
    });

    it("devrait créer une commande avec succès", async () => {
      const validOrder = {
        address: "123 Rue",
        paymentMethod: "Card",
        items: [{ productId: 1, quantity: 2 }],
      };

      // Appel 1: Vérification prod
      mockSingle.mockResolvedValueOnce({
        data: { id: 1, price: 10 },
        error: null,
      });

      // Appel 2: Add comm principale
      mockInsert.mockReturnValueOnce(mockChain);
      mockSingle.mockResolvedValueOnce({ data: { id: 999 }, error: null });

      // Appel 3: Add prod dans table order_items
      mockInsert.mockResolvedValueOnce({ error: null });

      const result = await createOrder("user123", validOrder);
      expect(result).toEqual({ id: 999 });
    });
  });

  describe("deleteOrder", () => {
    it("devrait supprimer une commande avec succès", async () => {
      mockEq.mockResolvedValueOnce({ error: null });
      const result = await deleteOrder(1);
      expect(result).toEqual({ message: "Commande supprimée" });
    });

    it("devrait lever une erreur si la suppression échoue", async () => {
      mockEq.mockResolvedValueOnce({ error: new Error("Erreur DB") });
      await expect(deleteOrder(1)).rejects.toThrow("Erreur DB");
    });
  });

  describe("getOrders", () => {
    it("devrait récupérer les commandes avec un userId spécifique", async () => {
      const mockData = [{ id: 1, total: 50 }];
      mockOrder.mockResolvedValueOnce({ data: mockData, error: null });
      const result = await getOrders("user123");
      expect(result).toEqual(mockData);
    });
  });

  describe("getOrderById", () => {
    it("devrait retourner une commande spécifique sans erreur", async () => {
      const mockData = { id: 1, total: 100 };
      mockSingle.mockResolvedValueOnce({ data: mockData, error: null });
      const result = await getOrderById(1);
      expect(result).toEqual(mockData);
    });

    it("devrait lever une erreur si la commande n'est pas trouvée", async () => {
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: new Error("Introuvable"),
      });
      await expect(getOrderById(99)).rejects.toThrow("Introuvable");
    });
  });
});
