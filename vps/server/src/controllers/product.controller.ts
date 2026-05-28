import type { Request, Response } from "express";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, } from "../services/product.service";

export const getAll = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await getAllProducts();

    res.json(products);
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const getOne = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const product = await getProductById(id);

    res.json(product);
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const create = async (
  req: Request,
  res: Response
) => {
  try {
    const product = await createProduct(req.body);

    res.status(201).json(product);
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    });
  }
};


export const update = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const product = await updateProduct(id, req.body);

    res.json(product);
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    });
  }
};


export const remove = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const result = await deleteProduct(id);

    res.json(result);
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    });
  }
};