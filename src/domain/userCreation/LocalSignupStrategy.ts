import { User } from "../../models/User";
import { CreateUser } from "./CreateUser";
import { UserCreationStrategy } from "./UserCreationStrategy";
import bcrypt from "bcrypt";
import { Model } from "mongoose";
import { logger } from "../../logger";

class LocalSignupStrategy implements UserCreationStrategy {
    private UserModel: Model<User>;
    constructor({ UserModel }: { UserModel: Model<User> }) {
        this.UserModel = UserModel;
    }

    isPasswordStrong(password: string): boolean {
        return password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);
    }

    async validateAndProcess(userData: CreateUser): Promise<string> {
        if (!userData.username) {
            throw new Error("Username is required");
        }
        if (!userData.password) {
            throw new Error("Password is required");
        }
        if (!this.isPasswordStrong(userData.password)) {
            throw new Error("Password is not strong enough");
        }
        if (!userData.email) {
            throw new Error("Email is required");
        }

        const existingUser = await this.UserModel.findOne(
            {
                $or: [{ username: userData.username }, { email: userData.email }],
            },
            "_id"
        ).exec();

        if (existingUser) {
            throw new Error("User already exists");
        }
        const saltRounds = 9;
        const passwordHash = await bcrypt.hash(userData.password, saltRounds);
        try {
            const user = await new this.UserModel({
                ...userData,
                passwordHash,
            }).save();
            return user._id.toString();
        } catch (err) {
            logger.error("Error creating user", err);
            throw new Error("Error creating user");
        }
    }
}

export { LocalSignupStrategy };
