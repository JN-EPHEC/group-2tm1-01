import type { Request, Response } from "express";
import * as orderService from "../services/order.service";

export const getOrders = async (
  req: Request,
  res: Response
) => {
  try {
    const orders = await orderService.getOrders();

    res.json(orders);
  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

export const getOrderById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const order = await orderService.getOrderById(id);

    res.json(order);
  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

export const createOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const order = await orderService.createOrder(req.body);

    res.status(201).json(order);
  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const updatedOrder = await orderService.updateOrderStatus(
      id,
      status
    );

    res.json(updatedOrder);
  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};