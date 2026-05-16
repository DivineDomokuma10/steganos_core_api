import { Request, Response } from "express";

const decodeController = async (req: Request, res: Response) => {
  console.log(req.body);
  return;
};

export default decodeController;
