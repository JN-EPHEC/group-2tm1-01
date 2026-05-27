import type { Request, Response, NextFunction } from "express";

export const checkIdParam = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    const error = new Error("L'ID doit être un nombre valide");
    (error as any).status = 400;
    return next(error);
  }
  next();
};
