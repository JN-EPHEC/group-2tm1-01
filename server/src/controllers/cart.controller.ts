import type { Request, Response } from "express";
import * as cartService from "../services/cart.service";

export const getCart = async (req: Request, res: Response) => {
  try {
    const cart = await cartService.getCart();

    res.json(cart);
  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const cartItem = await cartService.addToCart(req.body);

    res.status(201).json(cartItem);
  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { quantity } = req.body;

    const updatedItem = await cartService.updateCartItem(
      id,
      quantity
    );

    res.json(updatedItem);
  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

export const removeCartItem = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await cartService.removeCartItem(id);

    res.json({
      message: "Produit supprimé du panier",
    });
  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

export const clearCart = async (
  req: Request,
  res: Response
) => {
  try {
    await cartService.clearCart();

    res.json({
      message: "Panier vidé",
    });
  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};