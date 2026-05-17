import type { Request, Response } from "express";
import * as orderService from "../services/order.service";
import type { AuthRequest } from "../middlewares/auth.middleware";

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const orders = await orderService.getOrders(userId);
    
    res.json(orders);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const order = await orderService.getOrderById(id);

    if (!order) {
      return res.status(404).json({ error: "Commande introuvable" });
    }

    res.json(order);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const result = await orderService.createOrder(userId, req.body);

    res.status(201).json(result);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const updated = await orderService.updateOrderStatus(id, status);

    res.json(updated);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const result = await orderService.deleteOrder(id);

    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};