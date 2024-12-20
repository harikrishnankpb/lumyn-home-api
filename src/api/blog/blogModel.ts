import { Schema, model } from "mongoose";
import { z } from "zod";

const schemaOptions = {
	timestamps: true
}

const blogSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	views: {
		type: Number,
		default: 0
	},
	likes: {
		type: Number,
		default: 0
	},
	isActive: {
		type: Boolean,
		default: true
	},
	deletedOn: {
		type: Date
	},
}, schemaOptions);

export const BlogZodSchema = z.object({
	_id: z.string().optional(),
	title: z.string().min(1, "Title is required"),
	content: z.string().min(1, "Content is required"),
	views: z.number().optional(),
	likes: z.number().optional(),
	isActive: z.boolean().optional(),
	deletedOn: z.date().optional(),
});

export const Blog = model("Blog", blogSchema);
export type BlogType = z.infer<typeof BlogZodSchema>;