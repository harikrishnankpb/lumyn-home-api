import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/tokenHandler";
import { ServiceResponse } from "../models/serviceResponse";
import { handleServiceResponse } from "../utils/httpHandlers";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../models/commonResponseType";
import { logger } from "@/server";

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		const serviceResponse = ServiceResponse.failure<ApiResponse>("Unauthorized", { msg: "Not a valid User", status: false, data: { token: null } }, StatusCodes.UNAUTHORIZED);
		return handleServiceResponse(serviceResponse, res)
	}
	try {
		const payload = verifyToken(token);
		res.locals.user = payload;
		next();
	} catch (err) {
		const errorMessage = `Error while authorization in: ${(err as Error).message}`;
		logger.error(errorMessage);
		const serviceResponse = ServiceResponse.failure<ApiResponse>("Unauthorized", { msg: "Not a valid User", status: false, data: { token: null } }, StatusCodes.UNAUTHORIZED);
		return handleServiceResponse(serviceResponse, res)
	}
}
