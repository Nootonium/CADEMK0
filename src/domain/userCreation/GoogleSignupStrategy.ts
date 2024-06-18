import { User } from '../../models/User';
import { Error, Model } from 'mongoose';
import { UserCreationStrategy } from './UserCreationStrategy';
import { CreateUser } from './CreateUser';

class GoogleSignupStrategy implements UserCreationStrategy {
    private UserModel: Model<User>;
    constructor({ UserModel }: { UserModel: Model<User> }) {
        this.UserModel = UserModel;
    }

    async validateAndProcess(userData: CreateUser): Promise<string> {
        try {
            const existingUserByUsername = await this.UserModel.findOne({
                username: userData.username,
            });
            const existingUserByGoogleId = await this.UserModel.findOne({
                googleId: userData.googleId,
            });
            const existingUserByEmail = await this.UserModel.findOne({ email: userData.email });

            if (!existingUserByEmail && !existingUserByGoogleId && !existingUserByUsername) {
                const newUser = await new this.UserModel(userData).save();
                return newUser._id.toString();
            }

            throw new Error('User already there');
        } catch (err) {
            throw new Error('Ayo this bad');
        }
    }
}
export { GoogleSignupStrategy };
