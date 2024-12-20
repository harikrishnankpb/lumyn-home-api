import { TokenPayload } from "../models/commonResponseType";
import jwt from "jsonwebtoken";

export const verifyToken = (token: string): TokenPayload | null => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
		return decoded;
	} catch (error) {
		return null;
	}
};

export const generateToken = async (user: any): Promise<string> => {
	let tokenPayload = {
		_id: user?._id,
		role: user?.role,
		email: user?.email,
		name: user?.name
	}
	const token = jwt.sign(tokenPayload, process.env.JWT_SECRET as string, { expiresIn: "1d" });
	return token;
}