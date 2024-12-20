import type { Request, RequestHandler, Response } from "express";

import { blogService } from "@/api/blog/blogService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class BlogController {
	public create: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.create(req.body);
		return handleServiceResponse(serviceResponse, res);
	}
	public update: RequestHandler = async (req: Request, res: Response) => {
		const id = req.body.id;
		const serviceResponse = await blogService.update(id, req.body);
		return handleServiceResponse(serviceResponse, res)
	}
	public delete: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.delete(req.body);
		return handleServiceResponse(serviceResponse, res)
	}
	public showAll: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.delete(req.body);
		return handleServiceResponse(serviceResponse, res)
	}
	public showOne: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.delete(req.body);
		return handleServiceResponse(serviceResponse, res)
	}
	public showAllActive: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.delete(req.body);
		return handleServiceResponse(serviceResponse, res)
	}
	public showOneActive: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.delete(req.body);
		return handleServiceResponse(serviceResponse, res)
	}
}

export const blogController = new BlogController();
