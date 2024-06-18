import { Model, FilterQuery } from 'mongoose';

import { logger } from '../logger';
import { User } from '../models/User';
import { UserCreationProcessor } from '../domain/userCreation/UserCreationProcessor';
import { CreateUser } from '../domain/userCreation/CreateUser';
import { GoogleProfile } from '../domain/GoogleProfile';

interface FetchOptions {
    page?: number;
    limit?: number;
}

class UserService {
    private UserModel: Model<User>;
    private userCreationProcessor: UserCreationProcessor;

    constructor({ UserModel }: { UserModel: Model<User> }) {
        this.UserModel = UserModel;
        this.userCreationProcessor = new UserCreationProcessor({ UserModel });
    }

    private async findUser(criteria: object, projection?: string | object | string[]) {
        const user = await this.UserModel.findOne(criteria, projection).exec();
        if (!user) {
            logger.error(`User not found with criteria: ${JSON.stringify(criteria)}`);
            throw new Error('User not found');
        }
        return user;
    }

    async getUserById(
        userId: string,
        projection: string | object | string[] = 'username profilePictureKey',
    ) {
        const user = await this.UserModel.findById(userId, projection).exec();
        if (!user) {
            logger.error(`User not found with id: ${userId}`);
            throw new Error('User not found');
        }
        return user;
    }

    async findUserByUsername(username: string, projection?: string | object) {
        const user = await this.findUser({ username }, projection);
        return user;
    }

    async updateUserByUsername(username: string, update: Partial<User>) {
        const user = await this.findUser({ username: username }, '_id');
        const updatedUser = await this.UserModel.findByIdAndUpdate(user._id, update, {
            new: true,
        }).exec();
        if (!updatedUser) {
            logger.error(`User not updated with username: ${username}`);
            throw new Error('User not updated');
        }
        return updatedUser;
    }

    async findUsersByUsername(
        username?: string,
        projection: string | object = '_id',
        options: FetchOptions = {},
    ) {
        const query: FilterQuery<User> = {};
        const { page = 1, limit = 42 } = options;
        if (username) {
            query.username = { $regex: new RegExp(username, 'i') };
        }
        const usersQuery = this.UserModel.find(query, projection)
            .limit(limit)
            .skip((page - 1) * limit);
        const countQuery = this.UserModel.countDocuments(query);
        const [users, count] = await Promise.all([usersQuery, countQuery]);
        return {
            users: users as User[],
            totalPages: Math.ceil(count / limit),
        };
    }

    async deleteUserById(id: string) {
        await this.UserModel.findByIdAndDelete(id).exec();
    }

    async createUser(userData: CreateUser) {
        return await this.userCreationProcessor.process(userData);
    }

    async findOrCreateGoogleUser(profile: GoogleProfile) {
        const user = await this.UserModel.findOne({ googleId: profile.id });
        if (user) {
            return user;
        }
        const newUserData: CreateUser = {
            googleId: profile.id,
            username: profile.displayName,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            email: profile.emails?.[0].value || '',
        };
        const userId = await this.createUser(newUserData);
        return await this.UserModel.findById(userId).exec();
    }
}

export { UserService };
