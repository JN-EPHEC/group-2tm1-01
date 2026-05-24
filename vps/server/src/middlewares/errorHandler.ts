import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Erreur capturée par le middleware:", err);

  const statusCode = err.status || 500;
  const message = err.message || "Erreur srv";

  res.status(statusCode).json({ error: message });
};
