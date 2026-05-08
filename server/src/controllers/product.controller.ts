import type { Request, Response } from "express";
import { getAllProducts } from "../services/product.service";

export const getAll = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};