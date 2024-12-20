import { model, Schema } from "mongoose";
import { z } from "zod";

const schemaOptions = {
	timestamps: true
}

const userSchema = new Schema({
	name: {
		type: String
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		enum: ["admin"]
	},
	lastLogin: {
		type: Date,
		default: Date.now
	}
},
	schemaOptions
);

userSchema.pre("save", async function (next) {
	if (this.isModified("email")) {
		this.email = this.email.toLowerCase();
	}
})

const userZodSchema = z.object({
	_id: z.string().optional(),
	name: z.string().optional(),
	email: z.string().email(),
	password: z.string(),
	role: z.enum(["admin"]).optional(),
	lastLogin: z.date().optional()
});


export type User = z.infer<typeof userZodSchema>;

export const User = model("User", userSchema);