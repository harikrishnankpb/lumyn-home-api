import { z } from "zod";

const apiResponse = z.object({
	msg: z.string().optional(),
	status: z.boolean().optional(),
	data:z.any().optional()
});

const tokenPayload = z.object({
	_id: z.string(),
	role: z.string(),
	email: z.string(),
	isVerified: z.boolean(),
	validity: z.number()
})
export type ApiResponse = z.infer<typeof apiResponse>;
export type TokenPayload = z.infer<typeof tokenPayload>;