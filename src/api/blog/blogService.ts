import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { Blog, BlogType, BlogZodSchema } from "./blogModel";
import { ApiResponse } from "@/common/models/commonResponseType";
import { z } from "zod";
import { isValidObjectId } from "mongoose";
import dayjs from "dayjs";

export class BlogService {
	async create(blog: BlogType): Promise<ServiceResponse<ApiResponse | null>> {
		try {
			//Need to validate the blog object using zod schema

			const validationResult = BlogZodSchema.safeParse(blog);
			if (!validationResult.success) {
				const errorMessage = validationResult.error.errors.map(e => e.message).join(", ");
				return ServiceResponse.failure(errorMessage, { msg: errorMessage, status: false, data: null }, StatusCodes.BAD_REQUEST);
			}
			const newBlog = await new Blog({
				title: blog.title,
				content: blog.content
			}).save();
			return ServiceResponse.success<ApiResponse>("Blog created successfully", { msg: "Blog created successfully", status: true, data: newBlog }, StatusCodes.OK);
		} catch (err) {
			const errorMessage = `Error while logging in: ${(err as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while blog creating.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
	async update(id: string, blogInput: BlogType): Promise<ServiceResponse<ApiResponse | null>> {
		try {
			if (!id || !isValidObjectId(id) || !blogInput) {
				return ServiceResponse.failure("Invalid Id or Blog", { msg: 'Invalid id or blog', status: false, data: null }, StatusCodes.BAD_REQUEST);
			}
			let blog: BlogType | null = await Blog.findById(id);
			if (!blog || blog?.deletedOn) {
				return ServiceResponse.failure("Blog not found", { msg: 'Blog not found', status: false, data: null }, StatusCodes.NOT_FOUND);
			}
			if (blogInput.title) {
				blog.title = blogInput.title;
			}
			if (blogInput.content) {
				blog.content = blogInput.content;
			}
			if (blogInput.isActive != null) {
				blog.isActive = blogInput.isActive;
			}
			await blog.save();
			return ServiceResponse.success<ApiResponse>("Blog updated successfully", { msg: "Blog updated successfully", status: true, data: blog }, StatusCodes.OK);
		} catch (err) {
			const errorMessage = `Error while logging in: ${(err as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while blog updating.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
	async delete(id: string): Promise<ServiceResponse<ApiResponse | null>> {
		try {
			if (!id || !isValidObjectId(id)) {
				return ServiceResponse.failure("Invalid Id", { msg: 'Invalid id', status: false, data: null }, StatusCodes.BAD_REQUEST);
			}
			let blog: BlogType | null = await Blog.findById(id);
			if (!blog) {
				return ServiceResponse.failure("Blog not found", { msg: 'Blog not found', status: false, data: null }, StatusCodes.NOT_FOUND);
			}
			blog.deletedOn = dayjs().toDate();
			blog.isActive = false;
			await blog.save();
			return ServiceResponse.success<ApiResponse>("Blog deleted successfully", { msg: "Blog deleted successfully", status: true, data: blog }, StatusCodes.OK);
		} catch (err) {
			const errorMessage = `Error while logging in: ${(err as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while blog deleting.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
	async showAll(): Promise<ServiceResponse<ApiResponse | null>> {
		try {
			let blogs: BlogType[] | [] = await Blog.find({ $or: [{ deletedOn: null }, { deletedOn: { $exists: false } }] }).lean();
			return ServiceResponse.success<ApiResponse>("Success", { msg: "Success", status: true, data: blogs }, StatusCodes.OK);
		} catch (err) {
			const errorMessage = `Error while logging in: ${(err as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while blog listing.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
	async showAllActive(id: string): Promise<ServiceResponse<ApiResponse | null>> {
		try {
			let blogs: BlogType[] | [] = await Blog.find({ $and: [{ $or: [{ deletedOn: null }, { deletedOn: { $exists: false } }] }, { isActive: true }] }).lean();
			return ServiceResponse.success<ApiResponse>("Success", { msg: "Success", status: true, data: blogs }, StatusCodes.OK);
		} catch (err) {
			const errorMessage = `Error while logging in: ${(err as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while blog listing.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
	async showOne(id: string): Promise<ServiceResponse<ApiResponse | null>> {
		try {
			if (!id || !isValidObjectId(id)) {
				return ServiceResponse.failure("Invalid Id", { msg: 'Invalid id', status: false, data: null }, StatusCodes.BAD_REQUEST);
			}
			let blog: BlogType | null = await Blog.findOne({ $and: [{ _id: id }, { $or: [{ deletedOn: null }, { deletedOn: { $exists: false } }] }] }).lean();
			if (!blog) {
				return ServiceResponse.failure("Blog not found", { msg: 'Blog not found', status: false, data: null }, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<ApiResponse>("Success", { msg: "Success", status: true, data: blog }, StatusCodes.OK);
		} catch (err) {
			const errorMessage = `Error while logging in: ${(err as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while blog listing.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
	async showOneActive(id: string): Promise<ServiceResponse<ApiResponse | null>> {
		try {
			if (!id || !isValidObjectId(id)) {
				return ServiceResponse.failure("Invalid Id", { msg: 'Invalid id', status: false, data: null }, StatusCodes.BAD_REQUEST);
			}
			let blog: BlogType | null = await Blog.findOne({ $and: [{ _id: id }, { isActive: true }, { $or: [{ deletedOn: null }, { deletedOn: { $exists: false } }] }] }).lean();
			if (!blog) {
				return ServiceResponse.failure("Blog not found", { msg: 'Blog not found', status: false, data: null }, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<ApiResponse>("Success", { msg: "Success", status: true, data: blog }, StatusCodes.OK);
		} catch (err) {
			const errorMessage = `Error while logging in: ${(err as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while blog listing.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}

export const blogService = new BlogService();
