import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt"
import { User } from "@/api/user/userModel";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { ApiResponse } from "@/common/models/commonResponseType";
import dayjs from "dayjs";
import { generateToken } from "@/common/utils/tokenHandler";

export class UserService {

	async signIn(email: string, password: string): Promise<ServiceResponse<ApiResponse | null>> {
		try {
			const user: User | any = await User.findOne({ email });
			if (!user) {
				return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
			}
			let isValid = bcrypt.compareSync(password, user?.password);
			if (!isValid) {
				return ServiceResponse.failure("Invalid password", null, StatusCodes.UNAUTHORIZED);
			}
			let token = await generateToken(user);
			user.lastLogin = dayjs().toDate();
			await user.save();
			return ServiceResponse.success<ApiResponse>("User logged in successfully", { data: { token } }, StatusCodes.OK);
		} catch (err) {
			const errorMessage = `Error while logging in: ${(err as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while login.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
	async signUp(userData: User): Promise<ServiceResponse<ApiResponse | null>> {
		try {
			let name = userData.name;
			let email = userData.email.toLowerCase();
			let password = userData.password;
			let role = userData.role || 'admin';
			if (!name || !email || !password || !role) {
				return ServiceResponse.failure("All fields are required", null, StatusCodes.BAD_REQUEST);
			}
			const user: User | null = await User.findOne({ email });
			if (user) {
				return ServiceResponse.failure("User already exists", null, StatusCodes.CONFLICT);
			}
			let hashedPassword = bcrypt.hashSync(password, 10);
			const newUser = await new User({
				name,
				email,
				password: hashedPassword,
				role
			}).save();
			let token = await generateToken(newUser);
			return ServiceResponse.success<ApiResponse>("User registered successfully", { data: { token } }, StatusCodes.OK);
		} catch (err) {
			const errorMessage = `Error while logging in: ${(err as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while login.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}

export const userService = new UserService();
