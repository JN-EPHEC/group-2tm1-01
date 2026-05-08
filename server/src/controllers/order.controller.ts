import type { Request, Response } from "express";
import * as service from "../services/order.service";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const data = await service.getOrders();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
